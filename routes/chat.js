import { Router } from 'express';

import { hasJsonWebToken } from '../validator/valid.js';
import chatController from '../controller/chat.js';

const router = Router();

// GET /v1/chat/:channelId/:chatRoomId
router.get('/:channelId/:chatRoomId', hasJsonWebToken, chatController.getLoadChatRoom);

// PATCH /v1/chat/send/:channelId/:chatRoomId
router.patch('/:channelId/:chatRoomId', hasJsonWebToken, chatController.patchSendChat);

export default router;