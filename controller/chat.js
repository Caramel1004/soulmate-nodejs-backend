import chatService from '../service/chat.js'

import Channel from '../models/channel.js';
import User from '../models/user.js';
import { ChatRoom, Chat } from '../models/chat-room.js'

import SocketIO from '../socket.js';

const chatController = {
    //채팅룸 로딩
    getLoadChatRoom: async (req, res, next) => {
        try {
            const clientChannelId = req.params.channelId;
            const chatRoomId = req.params.chatRoomId;
            const userId = req.userId;

            const matchedUser = await User.findById(userId).populate('chatRooms');
            const chatRoomList = matchedUser.chatRooms.filter(room => room.channelId.toString() === clientChannelId.toString())
            const chatRoom = await ChatRoom.findById(chatRoomId)
                .populate('users', {
                    clientId: 1,
                    name: 1,
                    photo: 1
                })
                .populate('chatList');
            // .populate({
            //     path: 'chatList',
            //     populate: {
            //         path: 'creator',
            //         select: {
            //             _id: 1
            //         },
            //         sort: {createdAt: -1}
            //     }
            // });
            if (chatRoom.channelId.toString() !== clientChannelId.toString()) {
                const error = new Error('데이터베이스 채널아이디랑 일치하지 않습니다!');
                error.statusCode = 404;
                throw error;
            }

            // console.log('matchedUser: ', matchedUser);
            // console.log(`clientChannelId: ${clientChannelId}, chatRoomId: ${chatRoomId}`);
            // console.log('chatRoomList.chatList: ', chatRoomList.chatList);
            // console.log('chatRoom: ', chatRoom);
            // console.log('chatRoom.chatList: ', chatRoom.chatList);

            // 클라이언트에 보낼 데이터
            const userList = chatRoom.users;

            // 생성자 디테일 반환
            const chatList = chatRoom.chatList.map(chat => {
                const matchedCreator = userList.find(user => user._id.toString() === chat.creator.toString());
                return {
                    chat: chat.chat,
                    creator: matchedCreator,
                    createdAt: chat.createdAt
                }
            });
            // console.log('chatList: ', chatList);
            // 챗 오브젝트
            const chatRoomData = {
                _id: chatRoom._id,
                roomName: chatRoom.roomName,
                chatList: chatList,
            };

            res.status(200).json({
                msg: '채팅방이 로딩 되었습니다.',
                chatRooms: chatRoomList,
                chatRoomData: chatRoomData,
                userList: userList
            });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 채널에 속한 유저 불러오기 => 채팅룸에있는 채널유저리스트 보드에 렌더링 할거임
    getLoadUsersInChannel: async (req, res, next) => {
        try {
            const channelId = req.params.channelId;

            console.log(channelId);

            const resData = await chatService.getLoadUsersInChannel(channelId);
            
            res.status(resData.status.code).json({
                status: resData.status,
                users: resData.users
            })
        } catch (err) {
            throw err
        }
    },
    // 채팅룸에 유저 추가, 멤버 초대
    patchInviteUser: async (req, res, next) => {
        try {
            const userId = req.userId;// 접속한 유저

            const channelId = req.params.channelId
            const chatRoomId = req.params.chatRoomId;
            const selectedId = req.body.selectedId;// 배열 형태로 넘길 거임

            console.log('channelId: ', channelId);
            console.log('chatRoomId: ', chatRoomId);
            console.log('selectedId: ', selectedId);
            // 채널아이디로 해당 채팅룸이 있는지 부터 검사
            // 그 채팅룸 정보 가져오기 가져오기
            const matchedChannel = await Channel.findById(channelId).populate('chatRooms').populate('users');

            // 그아이디로 해당채팅룸조회
            const matchedChatRoom = matchedChannel.chatRooms.find(room => room._id.toString() === chatRoomId.toString());
            // console.log('matchedChatRoom: ', matchedChatRoom);
            if (!matchedChatRoom) {
                const error = new Error('현 채널에서 해당 채팅방을 조회하지 못했습니다.');
                error.statusCode = 404;
                throw error;
            }
            // 1. 채팅룸 스키마에 선택된 유저 추가
            const updatedChatRoomUsers = [...matchedChatRoom.users, ...selectedId];
            matchedChatRoom.users = [...updatedChatRoomUsers];

            await matchedChatRoom.save();
            // 2. 선택된 유저 스키마에 채팅룸 추가
            const channelUsers = matchedChannel.users;
            const selectdUsers = [];

            for (let id of selectedId) {
                const selectedUser = channelUsers.find(user => user._id.toString() === id);
                selectdUsers.push(selectedUser);
                selectedUser.chatRooms.push(id);
                await selectedUser.save();
            }

            res.status(200).json({
                msg: '팀원을 초대 했습니다.',
                users: selectdUsers
            });

        } catch (err) {
            throw err;
        }
    },
    // 실시간 채팅
    postSendChat: async (req, res, next) => {
        try {
            const channelId = req.params.channelId;// 해당 채널 doc아이디
            const userId = req.userId;// 현재 접속한 유저 doc아이디
            const chatRoomId = req.params.chatRoomId;// 해당 채팅룸 doc아이디
            const reqChat = req.body.chat;// 저장할 채팅

            console.log('reqChat: ',reqChat);

            //요청 바디
            const body = {
                chat: reqChat,
                creator: userId
            }

            const resData = await chatService.postSendChat(body, channelId, chatRoomId, userId);// 실시간으로 업데이트할 리턴 값

            // 웹 소켓: 채팅방에 속한 모든 유저의 채팅창 내용 업로드
            const serverIO = SocketIO.getSocketIO();
            serverIO.emit('sendChat', {
                status: resData.status,
                chatRoom: resData.chatRoom,
                currentChat: resData.chat,
                photo: resData.matchedUser.photo,
                clientId: resData.matchedUser.clientId
            });

            // 응답
            res.status(resData.status.code).json({
                status: resData.status
            });
        } catch (err) {
            throw err;
        }
    },
    postUploadFile: async (req, res, next) => {

    }
}

export default chatController;