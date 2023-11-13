import Channel from '../models/channel.js';
import { ChatRoom, Chat } from '../models/chat-room.js'

import { successType, errorType } from '../util/status.js';
import { hasArrayChannel, hasChannelDetail, hasUser, hasChatRoom } from '../validator/valid.js';

/**
 * 1. 채팅방 세부정보 로딩
 * 2. 팀원 추가 보드에 채널 멤버들 조회
 * 3. 실시간 채팅
 * 4. 실시간 파일 업로드
 * 5. 채팅방에 채널 멤버 초대
 */

const chatService = {
    /** 1. 채팅방 세부정보 조회 */
    getLoadChatRoom: async (channelId, chatRoomId, userId, next) => {
        try {
            /**1) 채팅방 세부 정보 조회 -> DB에서 발생한 에러는 catch문으로 처리
             * @params {objectId} channelId: 채널 아이디
             * @params {objectId} chatRoomId: 채팅방 아이디
             * @return {Object} - 채팅방 세부 정보
             * */
            const chatRoom = await ChatRoom.findOne({
                channelId: channelId,
                _id: chatRoomId
            })
                .populate('users', {
                    _id: 1,
                    name: 1,
                    photo: 1
                })
                .populate({
                    path: 'chats',
                    populate: {
                        path: 'creator',
                        select: {
                            _id: 1,
                            name: 1,
                            photo: 1
                        }
                    }
                })
                .sort({ createdAt: 1 });

            hasChatRoom(chatRoom);

            // 왜 인지는 잘모르겠는데 map 안에서 루프 돌때 post객체안에 정보말고도 다른 프로퍼티들이 있음 그중 정보가 저장되있는 프로퍼티는 _doc
            chatRoom.chats.map(chat => {
                if (chat.creator._id.toString() === userId.toString()) {
                    chat._doc.isCreator = true;// 일치
                } else {
                    chat._doc.isCreator = false;// 불일치
                }
                return chat;
            });

            // 2) 채팅룸에 속한 유저 목록중에 요청한 유저가 존재하는지 검사: 다른유저가 url타고 접속할수가 있기때문에 해당 유저가 없으면 접근 못하게 처리
            const chatRoomUser = chatRoom.users.find(user => user._id.toString() === userId.toString());

            hasUser(chatRoomUser);

            // 생성자 디테일 반환
            // const chatList = chatRoom.chatList.map(chat => {
            //     const matchedCreator = userList.find(user => user._id.toString() === chat.creator.toString());
            //     return {
            //         chat: chat.chat,
            //         creator: matchedCreator,
            //         createdAt: chat.createdAt
            //     }
            // });
            // console.log('chatList: ', chatList);
            // 챗 오브젝트

            return {
                status: successType.S02.s200,
                chatRoom: chatRoom
            }
        } catch (err) {
            next(err);
        }
    },
    /** 2. 팀원 추가 보드에 채널 멤버들 조회 */
    postLoadUsersInChannel: async (channelId, chatRoomId, next) => {
        try {
            console.log('channel:', channelId);
            const channel = await Channel.findById(channelId)
                .select({
                    members: 1
                })
                .populate('members', {
                    name: 1,
                    photo: 1,
                });

            const chatRoom = await ChatRoom.findOne({
                _id: chatRoomId,
                channelId: channelId
            })
                .select({ users: 1 });

            // 프로퍼티 추가시 프로퍼티 _doc에 추가
            // 채팅방에 이미 존재하는지 여부 추가
            channel.members.map(member => {
                for (let user of chatRoom.users) {
                    member._doc.exist = false;
                    if (member._id.toString() === user.toString()) {
                        member._doc.exist = true;
                        return member;
                    }
                }
                return member;
            })

            const status = successType.S02.s200;

            return {
                status: status,
                users: channel.members
            }
        } catch (err) {
            next(err);
        }
    },
    /** 3. 실시간 채팅과 파일 업로드 및 채팅창 실시간 업데이트 요청 */
    postSendChatAndUploadFilesToChatRoom: async (body, channelId, chatRoomId, userId, next) => {
        try {
            // 1. 채널에 조회 => 조회 실패하면 에러 throw
            const channel = await Channel.findById(channelId).select({ chatRooms: 1 });
            hasChannelDetail(channel);

            // 2. 채팅룸 조회 => 조회 실패하면 에러 throw
            const chatRoom = await ChatRoom.findById(chatRoomId)
                .select({
                    users: 1,
                    chats: 1
                })
                .populate('users', {
                    name: 1,
                    photo: 1
                });// chatRoomId로 조회된 채팅룸
            hasChatRoom(chatRoom);

            // 3. 해당 유저 조회 => 조회 실패하면 에러 throw
            const matchedUser = chatRoom.users.find(user => user._id.toString() === userId.toString());// 채팅룸에 해당 유저가 있는지 조회
            hasUser(matchedUser);

            // 4. 요청 바디(채팅 내용) 저장
            const chatObj = new Chat(body);// param: 저장할 요청 바디 return: 채팅내용 chat스키마에 저장 성공 응답
            const savedChat = await chatObj.save();

            // 5. 채팅룸 스키마에 chat오브젝트아이디 chatList 배열에 푸쉬
            chatRoom.chats.push(savedChat._id);// chat스키마에 저장된 chat오브젝트 아이디 chatList 배열에 푸쉬
            await chatRoom.save();// 채팅룸에 업데이트된 내용 저장

            // 6. 응답 상태
            const status = successType.S02.s200;

            return {
                status: status,
                chatRoom: chatRoom,
                matchedUser: matchedUser,
                chatAndFileUrls: savedChat
            }
        } catch (err) {
            next(err);
        }
    },
    // 4. 실시간 파일 업로드
    postUploadFileToChatRoom: async (body, channelId, chatRoomId, userId, next) => {
        try {
            // 1. 채널에  조회 => 조회 실패하면 에러 throw
            const channel = await Channel.findById(channelId).select({ chatRooms: 1 });
            hasChannelDetail(channel);

            // 2. 채팅룸 조회 => 조회 실패하면 에러 throw
            const chatRoom = await ChatRoom.findById(chatRoomId)
                .populate('users', {
                    clientId: 1,
                    name: 1,
                    photo: 1
                });// chatRoomId로 조회된 채팅룸
            hasChatRoom(chatRoom);

            // 3. 해당 유저 조회 => 조회 실패하면 에러 throw
            const matchedUser = chatRoom.users.find(user => user._id.toString() === userId.toString());// 채팅룸에 해당 유저가 있는지 조회
            hasUser(matchedUser);

            // 4. 요청 바디(파일 URL) 저장
            const chatObj = new Chat(body);// param: 저장할 요청 바디 return: 채팅내용 chat스키마에 저장 성공 응답
            const savedChat = await chatObj.save();

            // 5. 채팅룸 스키마에 chat오브젝트아이디 chatList 배열에 푸쉬
            chatRoom.chats.push(savedChat._id);// chat스키마에 저장된 chat오브젝트 아이디 chats 배열에 푸쉬
            await chatRoom.save();// 채팅룸에 업데이트된 내용 저장

            // 6. 응답 상태
            const status = successType.S02.s200;

            return {
                status: status,
                chatRoom: chatRoom,
                matchedUser: matchedUser,
                fileUrls: savedChat.fileUrls
            }
        } catch (err) {
            next(err);
        }
    },
    /** 4. 채팅방에 채널 멤버 초대 */
    patchInviteUserToChatRoom: async (selectedId, channelId, chatRoomId, next) => {
        try {
            // 채널아이디로 해당 채팅룸이 있는지 부터 검사
            // 1. 채널 정보 가져오기
            const matchedChannel = await Channel.findById(channelId).populate('chatRooms')
                .populate('members', {
                    _id: 1,
                    chatRooms: 1
                });

            hasChannelDetail(matchedChannel);

            // 2. 해당 채팅룸 조회
            const matchedChatRoom = matchedChannel.chatRooms.find(room => room._id.toString() === chatRoomId.toString());
            hasChatRoom(matchedChatRoom);

            // 필터 목록 1. 채널에 존재하나? 2. 워크스페이스에 중복되는 유저가 있나?
            // 채널에 멤버가 존재하는지 필터링 => 없으면 삭제 필터링
            const filterExistUserToChannel = selectedId.filter(selectedUser => {
                for (const existUser of matchedChannel.members) {
                    if (selectedUser.toString() === existUser._id.toString()) {
                        return selectedUser;
                    }
                }
            });
            // 중복되는 유저는 필터링
            const filterSelectedId = filterExistUserToChannel.filter(selectedUser => {
                for (const existUser of matchedChatRoom.users) {
                    if (selectedUser.toString() === existUser.toString()) {
                        console.log('중복');
                        return;
                    }
                }
                return selectedUser;
            })

            console.log(filterSelectedId);

            // 3. 채팅룸 스키마에 선택된 유저 추가
            const updatedChatRoomUsers = [...matchedChatRoom.users, ...filterSelectedId];
            matchedChatRoom.users = [...updatedChatRoomUsers];
            await matchedChatRoom.save();

            const status = successType.S02.s200;

            return {
                status: status,
                chatRoom: matchedChatRoom
            }
        } catch (err) {
            next(err);
        }
    },
    /** 5. 채팅방 퇴장 */
    patchExitChatRoom: async (userId, channelId, chatRoomId, next) => {
        try {
            /** 1) 현재 퇴장하려는 채팅방 조회
             * @params {ObjectId} 요청한 채널 아이디 
             * @params {ObjectId} 요청한 채팅룸 아이디 
             * @return {object} (property)매칭된 유저의 관심채널 배열
             * */
            const matchedChatRoom = await ChatRoom.findOne({
                _id: chatRoomId,
                channelId: channelId
            })
                .select({
                    users: 1,
                    chats: 1
                })
                .populate('users',{
                    name: 1
                });
            hasChatRoom(matchedChatRoom);
            const exitUser = matchedChatRoom.users.find(user => user._id.toString() === userId.toString())

            // 퇴장 멘트를 챗으로 저장
            const chatObj = await Chat.create({
                chat: `${exitUser.name}님이 퇴장하셨습니다.`,
                creator: exitUser._id,
                isNotice: 'Y'
            });

            // 2) 채팅방 스키마에 해당 유저 필터링 -> 제거
            const filteredChatRoomUsers = matchedChatRoom.users.filter(user => user._id.toString() !== userId.toString());
            console.log(filteredChatRoomUsers);

            if (filteredChatRoomUsers.length <= 0) {
                // 채널에서 해당 채팅방 제거
                const channel = await Channel.findById(channelId).select({ chatRooms: 1 });
                channel.chatRooms = [...channel.chatRooms.filter(chatRoom => chatRoom.toString() !== matchedChatRoom._id.toString())];
                await channel.save();

                // 채팅룸 스키마에서 해당 채팅방 삭제
                await ChatRoom.deleteOne({ _id: matchedChatRoom._id });
            } else {
                matchedChatRoom.users = [...filteredChatRoomUsers];
                matchedChatRoom.chats.push(chatObj._id);
                await matchedChatRoom.save();
            }

            return {
                status: successType.S02.s200,
                exitUser: exitUser
            }
        } catch (err) {
            next(err);
        }
    },
    /** 6. 채팅방 파일함 리스트 조회 */
    getLoadFilesInChatRoom: async (userId, channelId, chatRoomId, next) => {
        try {
            // channelSchema -> chatRoomSchema -> chatSchema property: fileUrls
            const channel = await Channel.findById(channelId)
            .select({
                chatRooms: 1
            })
            .populate({
                path: 'chatRooms',
                match: {
                    _id: chatRoomId,
                    channelId: channelId
                },
                select: 'chats',
                populate: {
                    path: 'chats',
                    select: 'fileUrls createdAt',
                    match: {
                        fileUrls: {
                            $gt: 0
                        }
                    },
                    options: {
                        sort: {
                            createdAt: -1
                        },
                    }
                }
            });
            hasChannelDetail(channel);
            const chatsWithFileUrlsInChatRoom = channel.chatRooms[0].chats
            return {
                status: successType.S02.s200,
                chatsWithFileUrlsInChatRoom: chatsWithFileUrlsInChatRoom
            };
        } catch (err) {
            next(err);
        }
    }
}

export default chatService;