import Channel from '../models/channel.js';
import User from '../models/user.js';
import { ChatRoom } from '../models/chat-room.js';

import { successType, errorType } from '../util/status.js';


const channelService = {
    // 서버에 있는 모든채널 목록 조회
    getChannelListToServer: async () => {
        try {
            const channels = await Channel.find();
            if (!channels) {
                const errReport = errorType.D.D04
                const error = new Error(errReport);
                throw error;
            }
            const status = successType.S02.s200;
            return {
                status: status,
                channels: channels
            }
        } catch (err) {
            throw err;
        }
    },
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
            console.log('service => body: ',body);
            // 1. 채널추가 요청한 유저의 아이디에 의한 데이터 조회
            const matchedUser = await User.findById(body.userId);

            if (body.thumbnail === '') {
                body.thumbnail = '/images/android-chrome-192x192.png';
            }

            // 2. 채널 추가 요청한 유저가 오너
            const owner = matchedUser._id;

            body.owner = owner;
            body.users = [];
            body.users.push(matchedUser._id);

            // 인스턴스 생성
            const channel = new Channel(body);

            // 3. 요청된 채널 정보 저장
            const createChannel = await channel.save();

            // 4. 해당 유저의 채널리스트에 채널아이디 추가
            matchedUser.channels.push(createChannel._id);

            await matchedUser.save();

            return successType.S02.s201;
        } catch (err) {
            throw err;
        }
    }
}

export default channelService;