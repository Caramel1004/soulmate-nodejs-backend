import Channel from '../models/channel.js';
import User from '../models/user.js';
import { ChatRoom } from '../models/chat-room.js';

import channelService from '../service/channel.js'
import { errorType, successType } from '../util/status.js';

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
 * 1. 채널아이디로 해당 채널 조회 -> 채널 세부페이지
 *      1-1. 채널에 팀원 초대
 *      1-2. 채널 세부정보
 * 2. 워크스페이스 목록 조회
 *      2-1. 워크 스페이스 목록중 하나 클릭 -> 세부정보 로딩
 *      2-2. 게시물 로딩
 * 3. 채팅방 목록 조회
 *      3-1. 채팅 방 입장 -> 채팅 히스토리 로딩
 * 4. 채팅룸 생성
 */


const channelController = {
    // 1. 생성된 오픈 채널 목록 조회
    getOpenChannelList: async (req, res, next) => {
        try {
            const resData = await channelService.getOpenChannelList(next);

            res.status(resData.status.code).json({
                status: resData.status,
                channels: resData.channels
            });
        } catch (err) {
            throw err;
        }
    },
    // 1-1. 오픈 채널 세부 정보 조회
    getOpenChannelDetail: async (req, res, next) => {
        try {
            const channelId = req.params.channelId;// 해당 오픈채널 아이디

            const resData = await channelService.getOpenChannelDetail(channelId, next);

            console.log('resData: ',resData);
            res.status(resData.status.code).json({
                status: resData.status,
                channelDetail: resData.channelDetail
            });
        } catch (err) {
            console.log('controller err: ',err)
            next(err);
        }
    },
    // 1-2. 오픈 채널 찜 클릭 -> 관심채널에 추가
    patchAddOpenChannelToWishChannel: async (req, res, next) => {
        try {
            const userId = req.userId;// 토큰에서 파싱한 유저아이디
            const channelId = req.body.ChannelId;// 채널 아이디

            const resData = await channelService.patchAddOpenChannelToWishChannel(channelId, userId);

            res.status(resData.status.code).json({
                status: resData.status
            });
        } catch (err) {
            throw err;
        }
    },
    // 2. 해당 유저의 채널 리스트 조회
    getChannelListByUserId: async (req, res, next) => {
        try {
            const userId = req.userId;// 토큰에서 파싱한 유저아이디

            const resData = await channelService.getChannelListByUserId(userId);

            // 해당 유저가 생성한 채널
            const ownedChannelList = resData.channels.filter(channel => channel.owner.ownerId.toString() === userId.toString());
            // 해당 유저가 참여하고있는 채널
            const invitedChannelList = resData.channels.filter(channel => channel.owner.ownerId.toString() !== userId.toString());

            res.status(resData.status.code).json({
                status: resData.status,
                ownedChannelList: ownedChannelList,
                invitedChannelList: invitedChannelList
            });
        } catch (err) {
            throw err;
        }
    },
    // 3. 채널아이디로 해당 채널 조회
    getChannelById: async (req, res, next) => {
        try {
            const userId = req.userId;
            const channelId = req.params.channelId;

            // 1. 유저가 해당 채널의 아이디를 가지고 있는지 부터 체크 없으면 에러 스루
            const userInfo = await User.findById(userId);
            const userChannelIdList = userInfo.channels;

            const matchedChannel = userChannelIdList.find(userChId => userChId.toString() === channelId.toString());

            if (!matchedChannel) {
                const error = new Error('해당채널을 찾지 못했습니다.');
                error.statusCode = 401;
                throw error;
            }

            // 2. 유저가 해당 채널의 아이디를 가지고있으면 다음 채널아이디로 해당채널 조회
            const finalChannel = await Channel.findById(matchedChannel._id).populate('users');

            if (!finalChannel) {
                const error = new Error('해당채널을 찾지 못했습니다.');
                error.statusCode = 401;
                throw error;
            }

            res.status(200).json({
                msg: '채널 입장 성공 입니다.',
                channel: finalChannel
            })

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 4. 채팅방 목록 조회
    getChatRoomListByUser: async (req, res, next) => {
        try {
            const channelId = req.params.channelId;
            const userId = req.userId;
            // console.log('channelId:', channelId);
            const chatRoomList = await ChatRoom.find({ channelId: channelId });
            // console.log('chatRoomList: ', chatRoomList);

            const userChatRooms = chatRoomList.filter(chatRoom => {
                const idx = chatRoom.users.indexOf(userId);
                if (idx !== -1) {
                    return chatRoom;
                }
            });

            // console.log('userChatRooms :', userChatRooms);
            res.status(200).json({
                msg: '채팅방 목록을 조회하였습니다.',
                chatRooms: userChatRooms
            });

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 5. 채널 생성
    postCreateChannel: async (req, res, next) => {
        try {
            console.log('req.body :', req.body);
            const userId = req.userId;
            const channelName = req.body.channelName;
            const open = req.body.open;
            let thumbnail = req.body.thumbnail;
            const category = req.body.category;
            const comment = req.body.comment;

            const categoryArr = [];
            categoryArr.push(category);
            console.log('categoryArr: ', categoryArr);

            const body = {
                userId: userId,
                open: open,
                channelName: channelName,
                thumbnail: thumbnail,
                category: categoryArr,
                comment: comment
            }

            console.log(body.category);

            const resData = await channelService.postCreateChannel(body);

            res.status(resData.code).json({
                resData: resData
            });
        } catch (err) {
            throw err;
        }
    },
    // 6. 해당 채널에서 퇴장
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
    // 7. 해당채널에 유저 초대
    patchInviteUserToChannel: async (req, res, next) => {
        try {
            const reqUserId = req.userId;
            const channelId = req.params.channelId;
            // const clientId = req.body.clientId;
            const invitedUserId = req.body.invitedUserId;
            // console.log('invitedUserId: ',invitedUserId);
            // console.log('channelId: ',channelId);

            const matchedChannel = await Channel.findById(channelId);
            // console.log('matchedChannel: ',matchedChannel);

            const findIndex = matchedChannel.users.findIndex(id => id.toString() === invitedUserId.toString());

            if (findIndex != -1) {
                const error = new Error('해당 유저는 이미 채널에 참여하고 있습니다.');
                error.statusCode = 401;
                throw error;
            }

            matchedChannel.users.push(invitedUserId);
            await matchedChannel.save();

            const user = await User.findById(invitedUserId);

            user.channels.push(matchedChannel._id);
            await user.save();

            res.status(200).json({
                msg: '유저가 초대되였습니다.',
                clientId: user.clientId,
                channel: matchedChannel
            })

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 8. 채팅룸 생성
    postCreateChatRoom: async (req, res, next) => {
        try {
            const channelId = req.params.channelId;
            const roomName = req.body.roomName;
            const userId = req.userId;

            const chatRoom = new ChatRoom({
                channelId: channelId,
                roomName: roomName,
            });

            // 1. 채팅방 생성
            const createdChatRoom = await chatRoom.save();

            // 2. 채팅방스키마에 배열타입인 유저컬럼에 유저 푸쉬후 저장
            const userInfo = await User.findById(userId);
            createdChatRoom.users.push(userInfo._id);
            const updatedUserToChatRoom = await createdChatRoom.save();

            // 3. 유저스키마에 채팅룸 컬럼에 채팅룸 아이디 푸쉬 후 저장
            userInfo.chatRooms.push(updatedUserToChatRoom._id);
            await userInfo.save();

            // 4. 해당 채널스키마에 채팅룸 컬럼에 채팅룸 아이디 푸쉬 후 저장 
            const channel = await Channel.findById(updatedUserToChatRoom.channelId);
            channel.chatRooms.push(updatedUserToChatRoom._id);
            await channel.save();

            res.status(201).json({
                msg: '채팅방이 생성되었습니다.',
                chatRoom: updatedUserToChatRoom
            });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
};

export default channelController;