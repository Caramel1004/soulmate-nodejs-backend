import Channel from '../models/channel.js';
import user from '../models/user.js';
import User from '../models/user.js'

const channelController = {
    // 해당 유저의 채널 리스트 조회
    getChannelList: async (req, res, next) => {
        try {
            const user = await User.findById('645bc55b7d8b60a0021cb1b5').populate('channels');//poplate함수로 해당아이디에대한 채널정보 모두 가져오기
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
            const channelId = req.params.channelId;

            // 1. 유저가 해당 채널의 아이디를 가지고 있는지 부터 체크 없으면 에러 스루
            const userInfo = await User.findById('645bc55b7d8b60a0021cb1b5');// 나중에는 토큰으로 유저 유무 구분 할거임
            const userChannelIdList = userInfo.channels;

            const matchedChannel = userChannelIdList.find(userChId => userChId.toString() === channelId.toString());

            if (!matchedChannel) {
                const error = new Error('해당채널을 찾지 못했습니다.');
                error.statusCode = 401;
                throw error;
            }

            // 2. 유저가 해당 채널의 아이디를 자기고있으면 다음 채널아이디로 해당채널 조회
            const finalChannel = await Channel.findById(matchedChannel._id);

            if (!finalChannel) {
                const error = new Error('해당채널을 찾지 못했습니다.');
                error.statusCode = 401
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
    // 채널 생성
    postCreateChannel: async (req, res, next) => {
        try {
            // 채널 이벤트 발생
            // 1. 채널 생성 2. 해당유저 소유자로 지정 3. 참여 채널 저장 4. 해당유저의 채널에 추가
            const channelName = req.body.channelName;
            let thumbnail = req.body.thumbnail;
            const matchedUser = await User.findById('645bc55b7d8b60a0021cb1b5');

            console.log('thumbnail: ',thumbnail);
            if(thumbnail === ''){
                thumbnail = 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg';
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
            console.log('channelId: ',channelId);
            const userId = '645bc55b7d8b60a0021cb1b5';
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
                msg:'해당 유저가 채널에서 퇴장하였습니다.',
                exitedUser: exitedUser
            })
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
};

export default channelController;