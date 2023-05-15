import { Router } from 'express';
import channelController from '../controller/channel.js';

const router = Router();

// GET /v1/channel
router.get('/', channelController.getChannelList);// 모든 채널 조회

//GET /v1/channel/:channelId
router.get('/:channelId', channelController.getChannelById);// 해당 채널에 접속

//POST /v1/channel/create
router.post('/create',channelController.postCreateChannel);// 채널 생성

//GET /v1/channel/exit/:channelId
router.patch('/exit/:channelId',channelController.patchExitChannel);// 채널 퇴장

export default router;
