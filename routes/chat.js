import { Router } from 'express';
import multer from 'multer';

import filesS3Handler from '../util/files-s3-handler.js';
import { hasJsonWebToken, hasChat, hasFile } from '../validator/valid.js';
import chatController from '../controller/chat.js';

const router = Router();

/**
 * 1. 채팅방 세부정보 조회
 * 2. 팀원 추가 보드에 채널 멤버들 조회
 * 3. 실시간 채팅
 * 4. 실시간 파일 업로드
 * 5. 채팅방에 채널 멤버 초대
 */


/** GET /v1/chat/:channelId/:chatRoomId
 * @method{GET}
 * @route {/v1/chat/:channelId/:chatRoomId}
 * 1. 채팅방 세부정보 조회
*/
router.get('/:channelId/:chatRoomId', hasJsonWebToken, chatController.getLoadChatRoom);


/** POST /v1/chat/channel-members/:channelId
 * @method{POST}
 * @route {/v1/chat/channel-members/:channelId}
 * 2. 팀원 추가 보드에 채널 멤버들 조회
*/
router.post('/channel-members/:channelId', chatController.postLoadUsersInChannel);


/** POST /v1/chat/:channelId/:chatRoomId
 * @method{POST}
 * @route {/v1/chat/:channelId/:chatRoomId}
 * 3. 실시간 채팅과 파일 업로드 및 채팅창 실시간 업데이트 요청
*/
router.post('/:channelId/:chatRoomId',
    hasJsonWebToken,
    multer({ limits: { fieldSize: 25 * 1024 * 1024 } }).array('files', 12),
    hasChat,
    filesS3Handler.uploadFilesToS3
    );// 3. 실시간 채팅과 파일 업로드 및 채팅창 실시간 업데이트 요청


/** PATCH /v1/chat/invite/:channelId/:chatRoomId
 * @method{PATCH}
 * @route {/v1/chat/invite/:channelId/:chatRoomId}
 * 4. 채팅방에 채널 멤버 초대
*/
router.patch('/invite/:channelId/:chatRoomId', hasJsonWebToken, chatController.patchInviteUserToChatRoom);


/** PATCH /v1/chat/invite/:channelId/:chatRoomId
 * @method{PATCH}
 * @route {/v1/chat/invite/:channelId/:chatRoomId}
 * 5. 채팅방 퇴장
*/
router.patch('/exit/:channelId/:chatRoomId', hasJsonWebToken, chatController.patchExitChatRoom);


/** GET /v1/chat/file-list/:channelId/:chatRoomId
 * @method{GET}
 * @route {/v1/chat/file-list/:channelId/:chatRoomId}
 * 6. 채팅방 파일함 리스트 조회
*/
router.get('/file-list/:channelId/:chatRoomId', hasJsonWebToken, chatController.getLoadFilesInChatRoom);// 7. 채팅방 파일함 리스트 조회


export default router;