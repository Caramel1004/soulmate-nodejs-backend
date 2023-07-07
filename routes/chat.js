import { Router } from 'express';

import { hasJsonWebToken, hasChat, hasFile } from '../validator/valid.js';
import chatController from '../controller/chat.js';

const router = Router();

/**
 * 1. 채팅방 세부정보 로딩
 * 2. 팀원 추가 보드에 채널 멤버들 조회
 * 3. 실시간 채팅
 * 4. 실시간 파일 업로드
 * 5. 채팅방에 채널 멤버 초대
 */

// GET /v1/chat/channel-members/:channelId
router.get('/channel-members/:channelId', chatController.getLoadUsersInChannel);// 2. 팀원 추가 보드에 채널 멤버들 조회

// GET /v1/chat/:channelId/:chatRoomId
router.get('/:channelId/:chatRoomId', hasJsonWebToken, chatController.getLoadChatRoom);// 1. 채팅방 세부정보 로딩

// POST /v1/chat/:channelId/:chatRoomId
router.post('/:channelId/:chatRoomId', hasJsonWebToken, hasChat, chatController.postSendChat);// 3. 실시간 채팅

// POST /v1/chat/upload-file/:channelId/:chatRoomId
router.post('/upload-file/:channelId/:chatRoomId', hasJsonWebToken, hasFile, chatController.postUploadFileToChatRoom);// 4. 실시간 파일 업로드

// PATCH /v1/chat/invite/:channelId/:chatRoomId
router.patch('/invite/:channelId/:chatRoomId', hasJsonWebToken, chatController.patchInviteUserToChatRoom);// 5. 채팅방에 채널 멤버 초대


export default router;