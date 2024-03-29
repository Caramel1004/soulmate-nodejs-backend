import chatService from '../service/chat.js'

import Channel from '../models/channel.js';
import { ChatRoom, Chat } from '../models/chat-room.js'

import { successType, errorType } from '../util/status.js';
import { hasReturnValue } from '../validator/valid.js'

import SocketIO from '../socket.js';

/**
 * 1. 채팅방 세부정보 조회
 * 2. 채팅방에서 채널 멤버들 조회
 * 3. 실시간 채팅과 파일 업로드 및 채팅창 실시간 업데이트 요청
 * 4. 채팅방에 채널 멤버 초대
 * 5. 채팅방 퇴장
 * 6. 채팅방 파일함 리스트 조회
 */

const chatController = {
    /** 1. 채팅방 세부정보 조회 */
    getLoadChatRoom: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const { channelId, chatRoomId } = req.params;

            const data = await chatService.getLoadChatRoom(channelId, chatRoomId, userId, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                chatRoom: data.chatRoom
            });
        } catch (err) {
            next(err);
        }
    },
    /** 2. 팀원 추가 보드에 채널 멤버들 조회 */
    getLoadUsersInChannel: async (req, res, next) => {
        try {
            const { channelId, chatRoomId } = req.params;

            const data = await chatService.getLoadUsersInChannel(channelId, chatRoomId, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                members: data.members
            });
        } catch (err) {
            next(err);
        }
    },
    /** 3. 실시간 채팅과 파일 업로드 및 채팅창 실시간 업데이트 요청 */
    postSendChatAndUploadFilesToChatRoom: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            /**
             * 해당 채널 doc아이디
             * 해당 채팅룸 doc아이디
             */
            const { channelId, chatRoomId } = req.params;
            const { chat, fileUrls } = req.body;// 저장할 채팅

            console.log('chat: ', chat);
            console.log('fileUrls: ', fileUrls);

            //요청 바디
            const body = {
                chat: chat,
                fileUrls: fileUrls,
                creator: userId
            }

            const data = await chatService.postSendChatAndUploadFilesToChatRoom(body, channelId, chatRoomId, userId, next);// 실시간으로 업데이트할 리턴 값

            hasReturnValue(data);

            // 웹 소켓: 채팅방에 속한 모든 유저의 채팅창 내용 업로드
            const serverIO = SocketIO.getSocketIO();
            serverIO.emit('sendChat', {
                status: data.status,
                chatRoom: data.chatRoom,
                currentChat: data.chatAndFileUrls,
                photo: data.matchedUser.photo,
                name: data.matchedUser.name
            });

            // 응답
            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    /** 4. 채팅방에 채널 멤버 초대 */
    patchInviteUserToChatRoom: async (req, res, next) => {
        try {
            const { authStatus } = req.user;

            const channelId = req.params.channelId
            const chatRoomId = req.params.chatRoomId;
            const selectedId = req.body.selectedId;// 배열 형태로 넘길 거임

            console.log('channelId: ', channelId);
            console.log('chatRoomId: ', chatRoomId);
            console.log('selectedId: ', selectedId);

            const data = await chatService.patchInviteUserToChatRoom(selectedId, channelId, chatRoomId, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    /** 5. 채팅방 퇴장 */
    patchExitChatRoom: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;

            const channelId = req.body.channelId
            const chatRoomId = req.body.chatRoomId;

            const data = await chatService.patchExitChatRoom(userId, channelId, chatRoomId, next);
            hasReturnValue(data)

            // 웹 소켓: 채팅방에 퇴장 메세지 보내기
            const serverIO = SocketIO.getSocketIO();
            serverIO.emit('exitUser', {
                exitUser: data.exitUser
            })

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    /** 6. 채팅방 파일함 리스트 조회 */
    getLoadFilesInChatRoom: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const { channelId, chatRoomId } = req.params;

            const data = await chatService.getLoadFilesInChatRoom(userId, channelId, chatRoomId, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                chatsWithFileUrlsInChatRoom: data.chatsWithFileUrlsInChatRoom
            });
        } catch (err) {
            next(err);
        }
    }
}

export default chatController;