import channelService from '../service/channel.js'

import { hasReturnValue } from '../validator/valid.js'

/**
 * 함수 목록
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
 * 10. 워크스페이스 생성
 * 11. 채팅룸 퇴장
 * 12. 워크스페이스 퇴장
 */


const channelController = {
    // 1. 생성된 오픈 채널 목록 조회
    getOpenChannelList: async (req, res, next) => {
        try {
            const data = await channelService.getOpenChannelList(next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                channels: data.channels
            });
        } catch (err) {
            next(err);
        }
    },
    // 1-1. 오픈 채널 세부 정보 조회
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
    // 1-2. 관심채널 추가 또는 삭제(토글 관계)
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
    // 2. 해당 유저의 채널 리스트 조회
    getChannelListByUserId: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const searchWord = req.query.searchWord;//찾을 종류

            console.log('searchWord: ', searchWord);
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
    // 3. 채널 생성
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
                channelId: data.channelId
            });
        } catch (err) {
            next(err);
        }
    },
    // 4. 관심 채널 조회 
    getWishChannelList: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;

            const data = await channelService.getWishChannelList(userId, req.query.searchWord, next);

            hasReturnValue(data);
            console.log(data);
            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                wishChannels: data.wishChannels
            });
        } catch (err) {
            next(err);
        }
    },
    // 5. 관심 채널 삭제
    patchRemoveOpenChannelToWishChannel: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const { channelId } = req.body;

            const data = await channelService.patchRemoveOpenChannelToWishChannel(userId, channelId, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                user: data.updatedUser
            });
        } catch (err) {
            next(err);
        }
    },
    // 6. 채널아이디로 해당 채널 조회
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
    // 6-1. 해당채널에 유저 초대
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
    // 6-2. 해당 채널에서 퇴장
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
                exitedUser: data.exitedUser
            });
        } catch (err) {
            next(err)
        }
    },
    // 8. 채팅방 목록 조회
    getChatRoomListByChannelAndUserId: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const channelId = req.params.channelId;

            const data = await channelService.getChatRoomListByChannelAndUserId(userId, channelId, next);

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
    // 9. 채팅룸 생성
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
    // 10. 워크스페이스 생성
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
    // 11. 워크스페이스 목록 조회
    getWorkSpaceListByChannelIdAndUserId: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user;
            const data = await channelService.getWorkSpaceListByChannelIdAndUserId(req.params.channelId, userId, next);
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
    getSearchChannelListBySearchKeyWord: async (req, res, next) => {
        try {
            const { category, searchWord } = req.query;

            const data = await channelService.getSearchChannelListBySearchKeyWord(category, searchWord, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                channels: data.channels
            })
        } catch (err) {
            next(err);
        }
    }
};

export default channelController;