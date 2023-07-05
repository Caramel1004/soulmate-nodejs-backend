import { Router } from 'express';

import { hasJsonWebToken } from '../validator/valid.js';
import channelController from '../controller/channel.js';

const router = Router();

//GET /v1/channel/openchannel-list
router.get('/openchannel-list', channelController.getOpenChannelList);//1. 오픈 채널 목록 조회

//GET /v1/channel/openchannel-list/:channelId
router.get('/openchannel-list/:channelId', channelController.getOpenChannelDetail);// 1-1. 오픈 채널 세부 정보 조회

//PATCH /v1/channel/openchannel-list/:channelId
router.patch('/openchannel-list/:channelId', hasJsonWebToken, channelController.patchAddOpenChannelToWishChannel);// 1-2. 오픈 채널 찜 클릭 -> 관심채널에 추가

// GET /v1/channel/mychannels
router.get('/mychannels', hasJsonWebToken, channelController.getChannelListByUserId);// 2. 해당 유저의 채널 리스트 조회

//POST /v1/channel/create
router.post('/create', hasJsonWebToken, channelController.postCreateChannel);// 3. 채널 생성

//GET /v1/channel/wishchannels
router.get('/wishchannels', hasJsonWebToken, channelController.getWishChannelList); // 4. 관심 채널 조회 

//GET /v1/channel/remove-wishchannel
router.patch('/remove-wishchannel', hasJsonWebToken, channelController.patchRemoveOpenChannelToWishChannel); // 5. 관심 채널 삭제 

//GET /v1/channel/:channelId
router.get('/:channelId', hasJsonWebToken, channelController.getChannelDetailByChannelId);// 6. 채널아이디로 해당 채널 조회

// GET /v1/channel/:channelId/chat
router.get('/:channelId/chat', hasJsonWebToken, channelController.getChatRoomListByChannelAndUserId);// 8. 채팅방 목록 조회

// POST /v1/channel/:channelId/create-chatRoom
router.post('/:channelId/create-chatRoom', hasJsonWebToken, channelController.postCreateChatRoom);// 9. 채팅방 생성

//PATCH /v1/channel/exit/:channelId
router.patch('/exit/:channelId', hasJsonWebToken, channelController.patchExitChannel);// 채널 퇴장

// PATCH /v1/channel/invite/:channelId
router.patch('/invite/:channelId', channelController.patchInviteUserToChannel);// 해당 채널에 유저 초대


export default router;
