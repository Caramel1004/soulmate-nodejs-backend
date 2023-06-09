import Channel from '../models/channel.js';
import User from '../models/user.js';
import { ChatRoom } from '../models/chat-room.js';

import { successType, errorType } from '../util/status.js';


const channelService = {
    // 해당 아이디의 채널목록 조회
    postSignUp: async (req,next) => {
        try {
            const user = new User({
                clientId: req.body.clientId,
                name: req.body.name,
                password: req.body.password
            });

            await user.save();

            if (!user) {
                const errReport = errorType.D.D04
                const error = new Error(errReport);
                throw error;
            }
            const status = successType.S02.s01;
            return status;
        } catch (err) {
            throw err;
        }
    }
}

export default channelService;