import { Router } from 'express';
import multer from 'multer';

import filesHandler from '../util/files-handler.js';
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
router.post('/channel-members/:channelId', chatController.postLoadUsersInChannel);// 2. 팀원 추가 보드에 채널 멤버들 조회

// GET /v1/chat/:channelId/:chatRoomId
router.get('/:channelId/:chatRoomId', hasJsonWebToken, chatController.getLoadChatRoom);// 1. 채팅방 세부정보 로딩

// POST /v1/chat/:channelId/:chatRoomId
router.post('/:channelId/:chatRoomId',
    hasJsonWebToken,
    multer({ storage: filesHandler.fileStorage, fileFilter: filesHandler.fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).array('files', 12),
    hasChat,
    filesHandler.saveUploadedFiles,
    chatController.postSendChatAndUploadFilesToChatRoom);// 3. 실시간 채팅과 파일 업로드 및 채팅창 실시간 업데이트 요청

// POST /v1/chat/upload-file/:channelId/:chatRoomId
// router.post('/upload-file/:channelId/:chatRoomId',
//     hasJsonWebToken,
//     multer({ storage: filesHandler.fileStorage, fileFilter: filesHandler.fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).array('files', 12),
//     hasFile,
//     filesHandler.saveUploadedFiles,
//     chatController.postUploadFileToChatRoom
// );// 4. 실시간 파일 업로드

// PATCH /v1/chat/invite/:channelId/:chatRoomId
router.patch('/invite/:channelId/:chatRoomId', hasJsonWebToken, chatController.patchInviteUserToChatRoom);// 5. 채팅방에 채널 멤버 초대

// PATCH /v1/chat/exit/:channelId/:chatRoomId
router.patch('/exit/:channelId/:chatRoomId', hasJsonWebToken, chatController.patchExitChatRoom);// 6. 채팅방 퇴장

// GET /v1/chat/file-list/:channelId/:chatRoomId
router.get('/file-list/:channelId/:chatRoomId', hasJsonWebToken, chatController.getLoadFilesInChatRoom);// 7. 채팅방 파일함 리스트 조회


export default router;