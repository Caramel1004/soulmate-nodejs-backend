import { Router } from 'express';
import chatController from '../controller/chat.js';

const router = Router();

// GET /v1/chat/:channelId/:chatRoomId
router.get('/:channelId/:chatRoomId',chatController.getLoadChatRoom);

// POST /v1/chat/:channelId/:chatRoomId/send
router.post('/:channelId/:chatRoomId',chatController.getLoadChatRoom);

export default router;