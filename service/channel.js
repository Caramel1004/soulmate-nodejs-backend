import Channel from '../models/channel.js';
import User from '../models/user.js';
import { ChatRoom } from '../models/chat-room.js';

import { successType, errorType } from '../util/status.js';


const channelService = {
    // 해당 아이디의 채널목록 조회
    getChannelListByUserId: async userId => {
        try {
            const user = await User.findById(userId).populate('channels');//poplate함수로 해당아이디에대한 채널정보 모두 가져오기

            if (!user) {
                const errReport = errorType.D.D04
                const error = new Error(errReport);
                throw error;
            }
            const status = successType.S02.s200;
            return {
                status: status,
                channels: user.channels
            };
        } catch (err) {
            throw err;
        }
    },
    // 채널 생성
    postCreateChannel: async body => {
        try {
            const matchedUser = await User.findById(body.userId);

            if (body.thumbnail === '') {
                body.thumbnail = '/images/android-chrome-192x192.png';
            }

            const owner = {
                ownerId: matchedUser._id,
                ownerName: matchedUser.name
            }

            body.owner = owner;
            body.users = [];
            body.users.push(matchedUser._id);

            const channel = new Channel(body);

            const createChannel = await channel.save();

            matchedUser.channels.push(createChannel._id);

            await matchedUser.save();

            return successType.S02.s201;
        } catch (err) {
            throw err;
        }
    }
}

export default channelService;