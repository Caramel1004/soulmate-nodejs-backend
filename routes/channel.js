import { Router } from 'express';
import multer from 'multer';

import { hasJsonWebToken, hasFile } from '../validator/valid.js';
import filesHandler from '../util/files-handler.js';

import channelController from '../controller/channel.js';
import filesS3Handler from '../util/files-s3-handler.js';

const router = Router();

/** ##API 기능 정리
 * 1. POST /api/v1/channel/openchannel-list: 검색키워드에의한 오픈 채널 검색 및 조회
 * 2. GET /api/v1/channel/openchannel-list/:channelId: 오픈 채널 세부정보 조회
 * 3. PATCH /api/v1/channel/add-or-remove-wishchannel: 관심채널 추가 또는 삭제
 * 4. GET /api/v1/channel/mychannels: 해당유저의 채널 목록 조회
 * 5. POST /api/v1/channel/create: 채널 생성
 * 6. POST /api/v1/channel/wishchannels: 검색키워드로 해당유저의 관심채널 목록 조회
 * 7. GET /api/v1/channel/:channelId: 해당채널의 세부정보 조회
 * 8. PATCH /api/v1/channel/invite/:channelId: 해당 채널에 유저 초대
 * 9. POST /api/v1/channel/:channelId/chat: 해당채널에서 유저가 속한 채팅룸 검색키워드로 목록 검색
 * 10.POST /api/v1/channel/:channelId/create-chatRoom: 해당채널에 채팅룸 생성
 * 11.POST /api/v1/channel/:channelId/create-workspace: 해당채널에 워크스페이스 생성
 * 12.POST /api/v1/channel/:channelId/workspace: 해당채널에서 유저가 속한 워크스페이스 검색키워드로 목록 검색
 * 13.PATCH /api/v1/channel/exit/:channelId: 해당채널 퇴장
 * 14.PATCH /api/v1/channel/create-feed/:channelId: 해당채널에 내 피드 생성
 * 15.PATCH /api/v1/channel/edit-feed/:channelId/:feedId: 해당채널에 내 피드 수정
 * 16.DELETE /api/v1/channel/delete-feed/:channelId/:feedId: 해당채널에 내 피드 삭제
 * 17.PATCH /api/v1/channel/plus-or-minus-feed-like: 피드 좋아요수 증가 또는 감소
 * 18. 채널 정보 수정
 */


/** POST /api/v1/channel/openchannel-list
 * @method{POST}
 * @route {/api/v1/channel/openchannel-list}
 * 1. 검색키워드에의한 오픈 채널 검색 및 조회
*/
router.post('/openchannel-list', channelController.getSearchOpenChannelListBySearchKeyWord);


/** GET /api/v1/channel/openchannel-list/:channelId
 * @method{GET}
 * @route {/api/v1/channel/openchannel-list/:channelId}
 * 2. 오픈 채널 세부정보 조회
 */
router.get('/openchannel-list/:channelId', channelController.getOpenChannelDetail);


/** PATCH /api/v1/channel/add-or-remove-wishchannel
 * @method{PATCH}
 * @route {/api/v1/channel/openchannel-list/:channelId}
 * 3. 관심채널 추가 또는 삭제
 */
router.patch('/add-or-remove-wishchannel', hasJsonWebToken, channelController.patchAddOrRemoveWishChannel);


/** GET /api/v1/channel/mychannels
 * @method{GET}
 * @route {/api/v1/channel/mychannels}
 * 4. 해당유저의 채널 목록 조회
 */
router.get('/mychannels', hasJsonWebToken, channelController.getChannelListByUserId);


/** POST /api/v1/channel/create
 * @method{POST}
 * @route {/api/v1/channel/create}
 * 5. 채널 생성
 */
router.post('/create',
    hasJsonWebToken,
    multer({ storage: filesHandler.fileStorage, fileFilter: filesHandler.fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).single('thumbnail'),
    filesHandler.saveUploadedChannelThumbnail,
    channelController.postCreateChannel);


/** POST /api/v1/channel/wishchannels
 * @method{POST}
 * @route {/api/v1/channel/wishchannels} 
 * 6. 검색키워드로 해당유저의 관심채널 목록 조회
 */
router.post('/wishchannels', hasJsonWebToken, channelController.getWishChannelList);


/** GET /api/v1/channel/:channelId
 * @method{GET}
 * @route {/api/v1/channel/:channelId} 
 * 7. 해당채널의 세부정보 조회
 */
router.get('/:channelId', hasJsonWebToken, channelController.getChannelDetailByChannelId);


/** PATCH /api/v1/channel/invite/:channelId
 * @method{PATCH}
 * @route {/api/v1/channel/invite/:channelId} 
 * 8. 해당 채널에 유저 초대
 */
router.patch('/invite/:channelId', hasJsonWebToken, channelController.patchInviteUserToChannel);


/** POST /api/v1/channel/:channelId/chat
 * @method{POST}
 * @route {/api/v1/channel/:channelId/chat} 
 * 9. 해당채널에서 유저가 속한 채팅룸 검색키워드로 목록 검색 
 */
router.post('/:channelId/chat', hasJsonWebToken, channelController.getChatRoomListByChannelAndUserId);


/** POST /api/v1/channel/:channelId/create-chatRoom
 * @method{POST}
 * @route {/api/v1/channel/:channelId/create-chatRoom} 
 * 10. 해당채널에 채팅룸 생성
 */
router.post('/:channelId/create-chatRoom', hasJsonWebToken, channelController.postCreateChatRoom);


/** POST /api/v1/channel/:channelId/create-workspace
 * @method{POST}
 * @route {/api/v1/channel/:channelId/create-workspace} 
 * 11. 해당채널에 워크스페이스 생성
 */
router.post('/:channelId/create-workspace', hasJsonWebToken, channelController.postCreateWorkSpace);


/** POST /api/v1/channel/:channelId/workspace
 * @method{POST}
 * @route {/api/v1/channel/:channelId/workspace} 
 * 12. 해당채널에서 유저가 속한 워크스페이스 검색키워드로 목록 검색 
 */
router.post('/:channelId/workspace', hasJsonWebToken, channelController.getWorkSpaceListByChannelIdAndUserId);


/** PATCH /api/v1/channel/exit/:channelId
 * @method{PATCH}
 * @route {/api/v1/channel/exit/:channelId} 
 * 13. 해당채널 퇴장
 */
router.patch('/exit/:channelId', hasJsonWebToken, channelController.patchExitChannel);


/** POST /api/v1/channel/create-feed/:channelId
 * @method{POST}
 * @route {/api/v1/channel/create-feed/:channelId} 
 * 14. 해당채널에 내 피드 생성
 */
router.post('/create-feed/:channelId',
    hasJsonWebToken,
    multer({ limits: { fieldSize: 25 * 1024 * 1024 } }).array('files', 12),
    filesS3Handler.uploadFilesToS3,
    channelController.postCreateFeedToChannel);


/** PATCH /api/v1/channel/edit-feed/:channelId/:feedId
 * @method{PATCH}
 * @route {/api/v1/channel/edit-feed/:channelId/:feedId} 
 * 15. 해당채널에 내 피드 수정
 */
router.patch('/edit-feed/:channelId/:feedId',
    hasJsonWebToken,
    multer({ limits: { fieldSize: 25 * 1024 * 1024 } }).array('files', 5),
    filesS3Handler.uploadFilesToS3,
    channelController.patchEditFeedToChannel);// 21. 홈채널에 내피드 수정


/** DELETE /api/v1/channel/delete-feed/:channelId/:feedId
 * @method{DELETE}
 * @route {/api/v1/channel/delete-feed/:channelId/:feedId} 
 * 16. 해당채널에 내 피드 삭제
 */
// DELETE /api/v1/channel/delete-feed/:channelId/:feedId
router.delete('/delete-feed/:channelId/:feedId', hasJsonWebToken, channelController.deleteRemoveFeedByUserId);// 22. 홈채널에 내피드 삭제


/** PATCH /api/v1/channel/plus-or-minus-feed-like
 * @method{DELETE}
 * @route {/api/v1/channel/plus-or-minus-feed-like} 
 * 17. 피드 좋아요수 증가 또는 감소
 */
router.patch('/plus-or-minus-feed-like', hasJsonWebToken, channelController.patchPlusOrMinusNumberOfLikeInFeed);

/** PATCH /api/v1/channel/edit-channel/:channelId
 * @method{PATCH}
 * @route {/api/v1/channel/edit-channel/:channelId} 
 * 18. 채널 정보 수정
 */
router.patch('/edit-channel/:channelId', hasJsonWebToken, channelController.patchEditChannelByCreator);

export default router;
