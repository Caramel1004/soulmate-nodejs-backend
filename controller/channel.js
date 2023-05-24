import Channel from '../models/channel.js';
import User from '../models/user.js';
import ChatRoom from '../models/chat-room.js';

const channelController = {
    // 해당 유저의 채널 리스트 조회
    getChannelList: async (req, res, next) => {
        try {
            const userId = req.userId;// 토큰에서 파싱한 유저아이디
            const user = await User.findById(userId).populate('channels');//poplate함수로 해당아이디에대한 채널정보 모두 가져오기
            // console.log(user)
            if (!user) {
                const error = new Error('채널리스트를 불러오지 못했습니다.');
                error.statusCode = 401;
                throw error;
            } else {
                const channels = user.channels;
                // console.log(channels);
                res.status(200).json({
                    msg: '채널 리스트 입니다.',
                    channels: channels
                });
            }
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 채널아이디로 해당 채널 조회
    getChannelById: async (req, res, next) => {
        try {
            const userId = req.userId;
            const channelId = req.params.channelId;

            // 1. 유저가 해당 채널의 아이디를 가지고 있는지 부터 체크 없으면 에러 스루
            const userInfo = await User.findById(userId);// 나중에는 토큰으로 유저 유무 구분 할거임
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
    // 채팅방 목록 조회
    getChatRoomListByUser: async (req, res, next) => {
        try {
            const channelId = req.params.channelId;
            const userId = req.userId;
            console.log('channelId:', channelId);
            const chatRoomList = await ChatRoom.find({ channelId: channelId });
            console.log('chatRoomList: ', chatRoomList);

            const userChatRooms = chatRoomList.filter(chatRoom => {
                const idx = chatRoom.users.indexOf(userId);
                if (idx !== -1) {
                    return chatRoom;
                }
            })

            console.log('userChatRooms :', userChatRooms);
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
    // 채널 생성
    postCreateChannel: async (req, res, next) => {
        try {
            // 채널 이벤트 발생
            // 1. 채널 생성 2. 해당유저 소유자로 지정 3. 참여 채널 저장 4. 해당유저의 채널에 추가
            const userId = req.userId;
            const channelName = req.body.channelName;
            let thumbnail = req.body.thumbnail;
            const matchedUser = await User.findById(userId);

            console.log('thumbnail: ', thumbnail);
            if (thumbnail === '') {
                thumbnail = '/images/android-chrome-192x192.png';
            }
            const owner = {
                ownerId: matchedUser._id,
                ownerName: matchedUser.name
            }

            const channel = new Channel({
                channelName: channelName,
                owner: owner,
                thumbnail: thumbnail
            });

            const createChannel = await channel.save();

            console.log(createChannel);
            matchedUser.channels.push(createChannel._id);
            await matchedUser.save();

            res.status(201).json({
                msg: '채널이 생성되었습니다.',
                channel: createChannel
            });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 해당 채널에서 퇴장
    patchExitChannel: async (req, res, next) => {
        try {
            // 1. 채널스키마에서 해당 유저 삭제
            const channelId = req.body.channelId;
            console.log('channelId: ', channelId);
            const userId = req.userId;
            const matchedChannel = await Channel.findById(channelId);

            const updatedUsers = matchedChannel.users.filter(id => id.toString() !== userId.toString());

            matchedChannel.users = [...updatedUsers];

            console.log('updatedUsers: ', updatedUsers);
            await matchedChannel.save();

            // 2. 유저스키마에서 해당 채널 삭제
            const exitedUser = await User.findById('645bc55b7d8b60a0021cb1b5');
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
    // 해당채널에 유저 초대
    patchInviteUserToChannel: async (req, res, next) => {
        try {
            const reqUserId = req.userId;
            const channelId = req.params.channelId;
            const clientId = req.body.clientId;
            const invitedUserId = req.body.invitedUserId;

            const matchedChannel = await Channel.findById(channelId);

            const findIndex = matchedChannel.users.findIndex(id => id.toString() === invitedUserId.toString());

            if (findIndex != -1) {
                const error = new Error('해당 유저는 이미 채널에 참여하고 있습니다.');
                error.statusCode = 401;
                throw error;
            }

            matchedChannel.users.push(invitedUserId);
            await matchedChannel.save();

            res.status(200).json({
                msg: '유저가 초대되였습니다.',
                clientId: clientId,
                channel: matchedChannel
            })

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    //채팅룸 생성
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

            // 4. 해당 채널스키마에 채팅룸 컬럼에  채팅룸 아이디 푸쉬 후 저장 
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