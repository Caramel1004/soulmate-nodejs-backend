import { Router } from 'express';
import multer from 'multer';

import { hasJsonWebToken, hasFile } from '../validator/valid.js';
import filesHandler from '../util/files-handler.js';

import channelController from '../controller/channel.js';

const router = Router();

/**
 * # 채널 입장 전
 * 1. 오픈 채널 목록 조회
 *      1-1. 오픈 채널 박스 클릭 -> 오픈 채널 세부정보 페이지
 *      1-2. 오픈 채널 찜 클릭 -> 관심채널에 추가
 * 2. 해당 유저의 채널 리스트 조회
 *      분류 목록: 내가만든 채널, 초대 받은 채널, 오픈 채널 -> 필터
 *      - 업무(비공개) 채널 조회
 *      - 초대 받은 채널
 *      - 오픈 채널 조회
 * 3. 채널 생성
 * 4. 관심 채널 조회 
 * 5. 관심 채널 삭제
 * 
 * #채널 입장 후
 * 6. 채널아이디로 해당 채널 조회 -> 채널 세부페이지
 *      6-1. 채널에 팀원 초대 -> 초대 메세지 전송
 *      6-2. 해당 채널에서 퇴장
 * 7. 워크스페이스 목록 조회
 *      2-1. 워크 스페이스 목록중 하나 클릭 -> 세부정보 로딩
 *      2-2. 게시물 로딩
 * 8. 채팅방 목록 조회
 *      8-1. 채팅 방 입장 -> 채팅 히스토리 로딩 -> chat스키마
 * 9. 채팅룸 생성
 */

//GET /v1/channel/openchannel-list
router.get('/openchannel-list', channelController.getOpenChannelList);//1. 오픈 채널 목록 조회

//GET /v1/channel/openchannel-list/:channelId
router.get('/openchannel-list/:channelId', channelController.getOpenChannelDetail);// 1-1. 오픈 채널 세부 정보 조회

//PATCH /v1/channel/add-or-remove-wishchannel
router.patch('/add-or-remove-wishchannel', hasJsonWebToken, channelController.patchAddOrRemoveWishChannel);// 1-2. 오픈 채널 찜 클릭 -> 함수 수정 -> 1-2. 관심채널 추가 또는 삭제(토글 관계)

// GET /v1/channel/mychannels
router.get('/mychannels', hasJsonWebToken, channelController.getChannelListByUserId);// 2. 해당 유저의 채널 리스트 조회

//POST /v1/channel/create
router.post('/create', hasJsonWebToken,
    multer({ storage: filesHandler.fileStorage, fileFilter: filesHandler.fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).single('thumbnail'),
    hasFile,
    filesHandler.saveUploadedChannelThumbnail,
    channelController.postCreateChannel);// 3. 채널 생성

//GET /v1/channel/wishchannels
router.get('/wishchannels', hasJsonWebToken, channelController.getWishChannelList); // 4. 관심 채널 조회 

//GET /v1/channel/remove-wishchannel
// router.patch('/remove-wishchannel', hasJsonWebToken, channelController.patchRemoveOpenChannelToWishChannel); // 5. 관심 채널 삭제 -> 1-2에 통합

//GET /v1/channel/:channelId
router.get('/:channelId', hasJsonWebToken, channelController.getChannelDetailByChannelId);// 6. 채널아이디로 해당 채널 조회

// PATCH /v1/channel/invite/:channelId
router.patch('/invite/:channelId', hasJsonWebToken, channelController.patchInviteUserToChannel);// 6-1. 해당 채널에 유저 초대

// GET /v1/channel/:channelId/chat
router.get('/:channelId/chat', hasJsonWebToken, channelController.getChatRoomListByChannelAndUserId);// 8. 채팅방 목록 조회

// POST /v1/channel/:channelId/create-chatRoom
router.post('/:channelId/create-chatRoom', hasJsonWebToken, channelController.postCreateChatRoom);// 9. 채팅방 생성

// POST /v1/channel/:channelId/create-workspace
router.post('/:channelId/create-workspace', hasJsonWebToken, channelController.postCreateWorkSpace);// 10. 워크스페이스 생성

// POST /v1/channel/:channelId/workspace
router.get('/:channelId/workspace', hasJsonWebToken, channelController.getWorkSpaceListByChannelIdAndUserId);// 11. 워크스페이스 목록 조회

//PATCH /v1/channel/exit/:channelId
router.patch('/exit/:channelId', hasJsonWebToken, channelController.patchExitChannel);// 6-2. 채널 퇴장

// POST /v1/channel/create-feed/:channelId
router.post('/create-feed/:channelId',
    hasJsonWebToken,
    multer({ storage: filesHandler.fileStorage, fileFilter: filesHandler.fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).array('files', 12),
    filesHandler.saveUploadedFiles,
    channelController.postCreateFeedToChannel);// 20. 홈채널에 내피드 생성

// PATCH /v1/channel//edit-feed/:channelId
// router.patch('/channel/edit-feed/:channelId', accessAuthorizedToken, multer({ storage: memoryStorage }).array('data', 1), clientController.patchEditMyProfileByReqUser);// 21. 홈채널에 내피드 수정

// DELETE /v1/channel//delete-feed/:channelId
// router.patch('/channel/delete-feed/:channelId', accessAuthorizedToken, multer({ storage: memoryStorage }).array('data', 1), clientController.patchEditMyProfileByReqUser);// 22. 홈채널에 내피드 삭제

// PATCH /v1/channel/plus-or-minus-feed-like
router.patch('/plus-or-minus-feed-like', hasJsonWebToken, channelController.patchPlusOrMinusNumberOfLikeInFeed);// 22. 홈채널에 내피드 삭제



export default router;
