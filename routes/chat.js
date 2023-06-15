import { Router } from 'express';

import { hasJsonWebToken, hasChat, hasFile } from '../validator/valid.js';
import chatController from '../controller/chat.js';

const router = Router();

// GET /v1/chat/:channelId/channel-users
router.get('/:channelId/channel-users', chatController.getLoadUsersInChannel);// 팀원 추가 보드에 채널 멤버들 로딩

// GET /v1/chat/:channelId/:chatRoomId
router.get('/:channelId/:chatRoomId', hasJsonWebToken, chatController.getLoadChatRoom);// 해당 채팅방 로딩

// POST /v1/chat/:channelId/:chatRoomId
router.post('/:channelId/:chatRoomId', hasJsonWebToken, hasChat, chatController.postSendChat);// 실시간 채팅

// POST /v1/chat/upload-file/:channelId/:chatRoomId
router.post('/upload-file/:channelId/:chatRoomId', hasJsonWebToken, hasFile);//실시간 파일 업로드

// PATCH /v1/chat/invite/:channelId/:chatRoomId
router.patch('/invite/:channelId/:chatRoomId', hasJsonWebToken, chatController.patchInviteUser);// 채팅방에 채널 멤버 초대


export default router;