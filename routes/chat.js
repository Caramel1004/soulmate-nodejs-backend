import { Router } from 'express';
import chatController from '../controller/chat.js';

const router = Router();

// GET /v1/chat/:channelId/:chatRoomId
router.get('/:channelId/:chatRoomId', chatController.getLoadChatRoom);

// PATCH /v1/chat/send/:channelId/:chatRoomId
router.patch('/:channelId/:chatRoomI/send', chatController.patchSendChat);

export default router;