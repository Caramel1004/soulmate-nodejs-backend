import { Router } from 'express';
import channelController from '../controller/channel.js';

const router = Router();

// GET /v1/channel
router.get('/', channelController.getChannelList);

//GET /v1/channel/:channelId
router.get('/:channelId', channelController.getChannelById);

//POST /v1/channel/create
router.post('/create',channelController.postCreateChannel);

export default router;
