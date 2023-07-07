import Channel from '../models/channel.js';
import User from '../models/user.js';
import { ChatRoom } from '../models/chat-room.js';

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
                status: data.status,
                channelDetail: data.channelDetail
            });
        } catch (err) {
            next(err);
        }
    },
    // 1-2. 오픈 채널 찜 클릭 -> 관심채널에 추가
    patchAddOpenChannelToWishChannel: async (req, res, next) => {
        try {
            const userId = req.userId;// 토큰에서 파싱한 유저아이디
            const channelId = req.body.channelId;// 채널 아이디

            const data = await channelService.patchAddOpenChannelToWishChannel(channelId, userId, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                user: data.user
            });
        } catch (err) {
            next(err);
        }
    },
    // 2. 해당 유저의 채널 리스트 조회
    getChannelListByUserId: async (req, res, next) => {
        try {
            const userId = req.userId;// 토큰에서 파싱한 유저아이디
            const searchWord = req.query.searchWord;//찾을 종류

            console.log('searchWord: ', searchWord);
            const data = await channelService.getChannelListByUserId(userId, searchWord, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
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
            const userId = req.userId;
            const channelName = req.body.channelName;
            const open = req.body.open;
            let thumbnail = req.body.thumbnail;
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

            res.status(data.code).json({
                data: data
            });
        } catch (err) {
            next(err);
        }
    },
    // 4. 관심 채널 조회 
    getWishChannelList: async (req, res, next) => {
        try {
            const userId = req.userId;

            const data = await channelService.getWishChannelList(userId, req.query.searchWord, next);

            hasReturnValue(data);
            console.log(data);
            res.status(data.status.code).json({
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
            const userId = req.userId;
            const { channelId } = req.body;

            const data = await channelService.patchRemoveOpenChannelToWishChannel(userId, channelId, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
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
            const userId = req.userId;
            const channelId = req.params.channelId;

            const data = await channelService.getChannelDetailByChannelId(userId, channelId, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
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
            const reqUserId = req.userId;
            const channelId = req.params.channelId;
            const invitedUserId = req.body.invitedUserId;
            console.log('invitedUserId: ', invitedUserId);
            console.log('channelId: ', channelId);

            const matchedChannel = await Channel.findById(channelId).select({ members: 1 });
            // console.log('matchedChannel: ',matchedChannel);

            const findIndex = matchedChannel.members.findIndex(id => id.toString() === invitedUserId.toString());

            if (findIndex != -1) {
                const error = new Error('해당 유저는 이미 채널에 참여하고 있습니다.');
                error.statusCode = 401;
                throw error;
            }

            matchedChannel.members.push(invitedUserId);
            await matchedChannel.save();

            const user = await User.findById(invitedUserId).select({ channels: 1 });

            user.channels.push(matchedChannel._id);
            await user.save();

            res.status(200).json({
                msg: '유저가 초대되였습니다.',
                name: user.name,
                channel: matchedChannel
            })

        } catch (err) {
            next(err);
        }
    },
    // 6-2. 해당 채널에서 퇴장
    patchExitChannel: async (req, res, next) => {
        try {
            // 1. 채널스키마에서 해당 유저 삭제
            const userId = req.userId;
            const channelId = req.body.channelId;
            console.log('channelId: ', channelId);
            const matchedChannel = await Channel.findById(channelId);

            const updatedUsers = matchedChannel.users.filter(id => id.toString() !== userId.toString());

            matchedChannel.users = [...updatedUsers];

            console.log('updatedUsers: ', updatedUsers);
            await matchedChannel.save();

            // 2. 유저스키마에서 해당 채널 삭제
            const exitedUser = await User.findById(userId);
            const updatedChannels = exitedUser.channels.filter(id => id.toString() !== channelId.toString());

            exitedUser.channels = [...updatedChannels];
            await exitedUser.save();

            res.status(200).json({
                msg: '해당 유저가 채널에서 퇴장하였습니다.',
                exitedUser: exitedUser
            })
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 8. 채팅방 목록 조회
    getChatRoomListByChannelAndUserId: async (req, res, next) => {
        try {
            const channelId = req.params.channelId;
            const userId = req.userId;

            const data = await channelService.getChatRoomListByChannelAndUserId(userId, channelId, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
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
            const channelId = req.params.channelId;
            const roomName = req.body.roomName;
            const userId = req.userId;

            const data = await channelService.postCreateChatRoom(channelId, userId, roomName, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                chatRoom: data.chatRoom
            });
        } catch (err) {
            next(err);
        }
    }
};

export default channelController;