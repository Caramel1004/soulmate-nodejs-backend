import { Router } from 'express';
import channelController from '../controller/channel.js';

const router = Router();

// GET /v1/channel
router.get('/', channelController.getChannelList);// 모든 채널 리스트 조회

//GET /v1/channel/:channelId
router.get('/:channelId', channelController.getChannelById);// 해당 채널에 접속

// GET /v1/channel/:channelId/chat
router.get('/:channelId/chat', channelController.getChatRoomListByUser);// 해당 채널의 채팅방 리스트 조회

//POST /v1/channel/create
router.post('/create',channelController.postCreateChannel);// 채널 생성

//PATCH /v1/channel/exit/:channelId
router.patch('/exit/:channelId',channelController.patchExitChannel);// 채널 퇴장

// POST /v1/channel/:channelId/chatRoom/create
router.post('/:channelId/chatRoom/create',channelController.postCreateChatRoom);// 채팅방 생성

export default router;
