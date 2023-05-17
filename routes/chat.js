import { Router } from 'express';
import chatController from '../controller/chat.js';

const router = Router();

// GET /v1/channel/:channelId/chat/:chatRoomId?name=''
router.get('/:chatRoomId', chatController.getLoadChatRoom);

export default router;