import channelService from '../service/channel.js'

import { hasReturnValue } from '../validator/valid.js'

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

const channelController = {
    /** 1. 검색키워드에의한 오픈 채널 검색 및 조회 */
    getSearchOpenChannelListBySearchKeyWord: async (req, res, next) => {
        try {
            let searchWord = req.body.searchWord;
            let category = req.body.category;

            if (searchWord == undefined) {
                searchWord = '';
            }

            if (category == '전체') {
                category = undefined;
            }

            const data = await channelService.getSearchOpenChannelListBySearchKeyWord(category, searchWord, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                channels: data.channels
            })
        } catch (err) {
            next(err);
        }
    },
    /** 2. 오픈 채널 세부정보 조회 */
    getOpenChannelDetail: async (req, res, next) => {
        try {
            const channelId = req.params.channelId;// 해당 오픈채널 아이디

            const data = await channelService.getOpenChannelDetail(channelId, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: data.authStatus,
                status: data.status,
                channelDetail: data.channelDetail
            });
        } catch (err) {
            next(err);
        }
    },
    /** 3. 관심채널 추가 또는 삭제 */
    patchAddOrRemoveWishChannel: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const { channelId } = req.body;// 채널 아이디

            const data = await channelService.patchAddOrRemoveWishChannel(channelId, userId, next);

            hasReturnValue(data);
            console.log(data);
            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                action: data.action
            });
        } catch (err) {
            next(err);
        }
    },
    /** 4. 해당유저의 채널 목록 조회 */
    getChannelListByUserId: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const searchWord = req.query.searchWord;//찾을 종류

            const data = await channelService.getChannelListByUserId(userId, searchWord, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                channels: data.channels
            });
        } catch (err) {
            next(err);
        }
    },
    /** 5. 채널 생성 */
    postCreateChannel: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const channelName = req.body.channelName;
            const open = req.body.open;
            let thumbnail = req.body.fileUrl;
            const category = req.body.category;
            const comment = req.body.comment;

            const categoryArr = [];
            categoryArr.push(category);

            const body = {
                userId: userId,
                open: open,
                channelName: channelName,
                thumbnail: thumbnail,
                category: categoryArr,
                comment: comment
            }

            const data = await channelService.postCreateChannel(body, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                channel: data.channel
            });
        } catch (err) {
            next(err);
        }
    },
    /** 6. 검색키워드로 해당유저의 관심채널 목록 조회 */
    getWishChannelList: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const { searchWord } = req.body;
            let category = req.body.category;

            if (category == '전체') {
                category = undefined;
            }

            const data = await channelService.getWishChannelList(userId, category, searchWord, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                wishChannels: data.wishChannels
            });
        } catch (err) {
            next(err);
        }
    },
    /** 7. 해당채널의 세부정보 조회 */
    getChannelDetailByChannelId: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const channelId = req.params.channelId;

            const data = await channelService.getChannelDetailByChannelId(userId, channelId, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                channel: data.channel
            });
        } catch (err) {
            next(err);
        }
    },
    /** 8. 해당 채널에 유저 초대 */
    patchInviteUserToChannel: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const channelId = req.params.channelId;
            const selectedIds = req.body.selectedIds;

            const data = await channelService.patchInviteUserToChannel(channelId, selectedIds, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                channel: data.channel,
                users: data.users
            });
        } catch (err) {
            next(err);
        }
    },
    /** 9. 해당채널에서 유저가 속한 채팅룸 검색키워드로 목록 검색 */
    getChatRoomListByChannelAndUserId: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const channelId = req.params.channelId;
            const { searchWord } = req.body;
            let keyword = searchWord;

            if (keyword == undefined) {
                keyword = '';
            }

            const data = await channelService.getChatRoomListByChannelAndUserId(userId, channelId, keyword, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                chatRooms: data.chatRooms
            });
        } catch (err) {
            next(err);
        }
    },
    /** 10. 해당채널에 채팅룸 생성 */
    postCreateChatRoom: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const channelId = req.params.channelId;
            const roomName = req.body.roomName;

            const data = await channelService.postCreateChatRoom(channelId, userId, roomName, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                chatRoom: data.chatRoom
            });
        } catch (err) {
            next(err);
        }
    },
    /** 11. 해당채널에 워크스페이스 생성 */
    postCreateWorkSpace: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const channelId = req.params.channelId;

            const data = await channelService.postCreateWorkSpace(channelId, userId, req.body, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                workSpace: data.workSpace
            })
        } catch (err) {
            next(err);
        }
    },
    /** 12. 해당채널에서 유저가 속한 워크스페이스 검색키워드로 목록 검색 */
    getWorkSpaceListByChannelIdAndUserId: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const { searchWord } = req.body;
            let keyword = searchWord;

            if (keyword == undefined) {
                keyword = '';
            }

            const data = await channelService.getWorkSpaceListByChannelIdAndUserId(req.params.channelId, keyword, userId, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                workSpaces: data.workSpaces,
                openWorkSpaces: data.openWorkSpaces
            })
        } catch (err) {
            next(err);
        }
    },
    /** 13. 해당채널 퇴장 */
    patchExitChannel: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const channelId = req.body.channelId;

            const data = await channelService.patchExitChannel(userId, channelId, next);

            hasReturnValue(data);

            console.log(data);
            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                updatedChannels: data.updatedChannels
            });
        } catch (err) {
            next(err)
        }
    },
    /** 14. 해당채널에 내 피드 생성 */
    postCreateFeedToChannel: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const { channelId } = req.params;
            const { title, content, fileUrls } = req.body;

            const data = await channelService.postCreateFeedToChannel(userId, channelId, title, content, fileUrls, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                feed: data.feed
            })
        } catch (err) {
            next(err);
        }
    },
    /** 15. 해당채널에 내 피드 수정 */
    patchEditFeedToChannel: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const { channelId, feedId } = req.params;
            const { title, content, fileUrls } = req.body;

            const data = await channelService.patchEditFeedToChannel(userId, channelId, feedId, title, content, fileUrls, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                feed: data.feed
            })
        } catch (err) {
            next(err);
        }
    },
    /** 16. 해당채널에 내 피드 삭제 */
    deleteRemoveFeedByUserId: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const { channelId, feedId } = req.params;

            const data = await channelService.deleteRemoveFeedByUserId(userId, channelId, feedId, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status
            })
        } catch (err) {
            next(err);
        }
    },
    /** 17. 피드 좋아요수 증가 또는 감소 */
    patchPlusOrMinusNumberOfLikeInFeed: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const { channelId, feedId } = req.body;

            const data = await channelService.patchPlusOrMinusNumberOfLikeInFeed(userId, channelId, feedId, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                numberOfLikeInFeed: data.numberOfLikeInFeed
            })
        } catch (err) {
            next(err);
        }
    },
    /** 18. 채널 정보 수정 */
    patchEditChannelByCreator: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const { channelId } = req.params;
            const { open, channelName, comment, category } = req.body;

            const data = await channelService.patchEditChannelByCreator(userId, channelId, open, channelName, comment, category, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                numberOfLikeInFeed: data.numberOfLikeInFeed
            })
        } catch (err) {
            next(err);
        }
    },
};

export default channelController;