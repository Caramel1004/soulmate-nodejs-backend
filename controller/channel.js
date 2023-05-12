import Channel from '../models/channel.js';
import User from '../models/user.js'

const channelController = {
    // 채널 리스트 조회
    getChannelList: async (req, res, next) => {
        try {
            const user = await User.findById('645bc55b7d8b60a0021cb1b5').populate('channels');//poplate함수로 해당아이디에대한 채널정보 모두 가져오기
            console.log(user)
            if (!user) {
                const error = new Error('채널리스트를 불러오지 못했습니다.');
                error.statusCode = 401;
                throw error;
            } else {
                const channels = user.channels;
                console.log(channels);
                res.status(200).json({
                    msg: '채널 리스트 입니다.',
                    channels: channels
                })
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
            const channelId = req.params.channelId;
            const channel = await Channel.findById(channelId);
            if (!channel) {
                const error = new Error('해당채널을 찾지 못했습니다.');
            } else {
                res.status(200).json({
                    msg: '채널 입장 성공 입니다.',
                    channel: channel
                })
            }
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
            const channelName = req.body.channelName;
            const thumbnail = req.body.thumbnail;
            const matchedUser = await User.findById('645bc55b7d8b60a0021cb1b5');
            
            console.log(matchedUser)

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
    }
};

export default channelController;