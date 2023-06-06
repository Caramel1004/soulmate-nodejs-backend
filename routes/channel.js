import { Router } from 'express';

import { hasJsonWebToken } from '../validator/valid.js';
import channelController from '../controller/channel.js';

const router = Router();

// GET /v1/channel
router.get('/', hasJsonWebToken, channelController.getChannelListByUserId);// 모든 채널 리스트 조회

//GET /v1/channel/:channelId
router.get('/:channelId', hasJsonWebToken,channelController.getChannelById);// 해당 채널에 접속

// GET /v1/channel/:channelId/chat
router.get('/:channelId/chat', hasJsonWebToken,channelController.getChatRoomListByUser);// 해당 채널의 채팅방 리스트 조회

//POST /v1/channel/create
router.post('/create', hasJsonWebToken,channelController.postCreateChannel);// 채널 생성

//PATCH /v1/channel/exit/:channelId
router.patch('/exit/:channelId', hasJsonWebToken,channelController.patchExitChannel);// 채널 퇴장

// PATCH /v1/channel/invite/:channelId
router.patch('/invite/:channelId', channelController.patchInviteUserToChannel);// 해당 채널에 유저 초대

// POST /v1/channel/:channelId/chatRoom/create
router.post('/:channelId/chatRoom/create', hasJsonWebToken,channelController.postCreateChatRoom);// 채팅방 생성

export default router;
