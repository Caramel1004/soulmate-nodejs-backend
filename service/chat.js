import Channel from '../models/channel.js';
import { ChatRoom, Chat } from '../models/chat-room.js'

import { successType, errorType } from '../util/status.js';


const chatService = {
    // 채널에 속한 유저 불러오기 => 채팅룸에있는 채널유저리스트 보드에 렌더링 할거임
    getLoadUsersInChannel: async channelId => {
        try {
            const channelUsers = await Channel.findById(channelId)
                .select('users')
                .populate('users', {
                    clientId: 1,
                    name: 1,
                    photo: 1
                })
                .sort({ clientId: 1 });

            const users = channelUsers.users;
            const status = successType.S02.s200;

            return {
                status: status,
                users: users
            }
        } catch (err) {
            throw err;
        }
    },
    // 채팅 내용 저장
    postSendChat: async (body, channelId, chatRoomId, userId) => {
        try {
            // 1. 채널에  조회 => 조회 실패하면 에러 throw
            const channel = await Channel.findById(channelId).select({ chatRooms: 1 });
            if (!channel) {
                const error = new Error(errorType.D04.d404);// 데이터베이스에서 조회 실패
                throw error;
            }

            // 2. 채팅룸 조회 => 조회 실패하면 에러 throw
            const chatRoom = await ChatRoom.findById(chatRoomId)
                .populate('users', {
                    clientId: 1,
                    name: 1,
                    photo: 1
                });// chatRoomId로 조회된 채팅룸
            if (!chatRoom) {
                const error = new Error(errorType.D04.d404);// 데이터베이스에서 조회 실패
                throw error;
            }

            // 3. 해당 유저 조회 => 조회 실패하면 에러 throw
            const matchedUser = chatRoom.users.find(user => user._id.toString() === userId.toString());// 채팅룸에 해당 유저가 있는지 조회
            if (!matchedUser) {
                const error = new Error(errorType.D04.d404);// 데이터베이스에서 조회 실패
                throw error;
            }

            // 4. 요청 바디(채팅 내용) 저장
            const chatObj = new Chat(body);// param: 저장할 요청 바디 return: 채팅내용 chat스키마에 저장 성공 응답
            const savedChat = await chatObj.save();

            // 5. 채팅룸 스키마에 chat오브젝트아이디 chatList 배열에 푸쉬
            chatRoom.chatList.push(savedChat._id);// chat스키마에 저장된 chat오브젝트 아이디 chatList 배열에 푸쉬
            await chatRoom.save();// 채팅룸에 업데이트된 내용 저장

            // 6. 응답 상태
            const status = successType.S02.s200;

            return {
                status: status,
                chatRoom: chatRoom,
                matchedUser: matchedUser,
                chat: savedChat.chat
            }
        } catch (err) {
            throw err;
        }
    },
    // 파일 URL 저장
    postUploadFileToChatRoom: async (body, channelId, chatRoomId, userId) => {
        try {
            // 1. 채널에  조회 => 조회 실패하면 에러 throw
            const channel = await Channel.findById(channelId).select({ chatRooms: 1 });
            if (!channel) {
                const error = new Error(errorType.D04.d404);// 데이터베이스에서 조회 실패
                throw error;
            }

            // 2. 채팅룸 조회 => 조회 실패하면 에러 throw
            const chatRoom = await ChatRoom.findById(chatRoomId)
                .populate('users', {
                    clientId: 1,
                    name: 1,
                    photo: 1
                });// chatRoomId로 조회된 채팅룸
            if (!chatRoom) {
                const error = new Error(errorType.D04.d404);// 데이터베이스에서 조회 실패
                throw error;
            }

            // 3. 해당 유저 조회 => 조회 실패하면 에러 throw
            const matchedUser = chatRoom.users.find(user => user._id.toString() === userId.toString());// 채팅룸에 해당 유저가 있는지 조회
            if (!matchedUser) {
                const error = new Error(errorType.D04.d404);// 데이터베이스에서 조회 실패
                throw error;
            }

            // 4. 요청 바디(파일 URL) 저장
            const chatObj = new Chat(body);// param: 저장할 요청 바디 return: 채팅내용 chat스키마에 저장 성공 응답
            const savedChat = await chatObj.save();

            // 5. 채팅룸 스키마에 chat오브젝트아이디 chatList 배열에 푸쉬
            chatRoom.chatList.push(savedChat._id);// chat스키마에 저장된 chat오브젝트 아이디 chatList 배열에 푸쉬
            await chatRoom.save();// 채팅룸에 업데이트된 내용 저장

            // 6. 응답 상태
            const status = successType.S02.s200;

            return {
                status: status,
                chatRoom: chatRoom,
                matchedUser: matchedUser,
                fileUrl: savedChat.fileUrl
            }
        } catch (err) {
            throw err;
        }
    },
    // 채팅룸 유저 초대
    patchInviteUserToChatRoom: async (selectedId, channelId, chatRoomId) => {
        try {
            // 채널아이디로 해당 채팅룸이 있는지 부터 검사
            // 1. 채널 정보 가져오기
            const matchedChannel = await Channel.findById(channelId).populate('chatRooms')
                .populate('users', {
                    _id: 1,
                    chatRooms: 1
                });

            if (!matchedChannel) {
                const error = new Error(errorType.D04.d404);// 데이터베이스에서 조회 실패
                throw error;
            }

            // 2. 해당 채팅룸 조회
            const matchedChatRoom = matchedChannel.chatRooms.find(room => room._id.toString() === chatRoomId.toString());
            // console.log('matchedChatRoom: ', matchedChatRoom);
            if (!matchedChatRoom) {
                const error = new Error(errorType.D04.d404);// 데이터베이스에서 조회 실패
                throw error;
            }

            // 3. 채팅룸 스키마에 선택된 유저 추가
            const updatedChatRoomUsers = [...matchedChatRoom.users, ...selectedId];
            matchedChatRoom.users = [...updatedChatRoomUsers];
            await matchedChatRoom.save();

            // 4. 선택된 유저 스키마에 채팅룸 추가
            const channelUsers = matchedChannel.users;

            for (let id of selectedId) {
                const selectedUser = channelUsers.find(user => user._id.toString() === id);
                selectedUser.chatRooms.push(chatRoomId);
                await selectedUser.save();
            }

            const status = successType.S02.s200;

            return {
                status: status
            }
        } catch (err) {
            throw err;
        }
    }
}

export default chatService;