import jwt from 'jsonwebtoken';

import Channel from '../models/channel.js';
import User from '../models/user.js';
import { ChatRoom } from '../models/chat-room.js';

import { successType, errorType } from '../util/status.js';
import { hasUser, vaildatePasswordOfUser, hasAuthorizationToken } from '../validator/valid.js'


const channelService = {
    // 회원 가입
    postSignUp: async body => {
        try {
            const user = new User(body);

            const savedUser = await user.save();

            if (!savedUser) {
                const errReport = errorType.D.D04;
                const error = new Error(errReport);
                throw error;
            }

            const status = successType.S02.s201;
            return status;
        } catch (err) {
            throw err;
        }
    },
    //회원 로그인
    postLogin: async (email, pwd, next) => {
        try {
            const user = await User.findOne({ email: email });

            console.log(user);

            // 사용자 존재유무 체크
            hasUser(user);

            // 나중에 bcrypt 추가할 예정
            // 비밀번호 일치하는지 체크
            vaildatePasswordOfUser(user.password, pwd);

            // jwt 발급
            const token = jwt.sign({
                userId: user._id
            },
                'caramel',
                { expiresIn: '2h' }
            );

            // 토큰 발급 유무
            hasAuthorizationToken(token);

            console.log('token 발급: ', token);

            return {
                token: token,
                photo: user.photo,
                name: user.name,
                status: successType.S02.s200
            }
        } catch (err) {
            next(err);
        }
    },
    // 유저 정보 조회
    getUserInfo: async (name, next) => {
        try {
            const matchedUser = await User.findOne(
                { name: name },
                {
                    _id: 1,
                    email: 1,
                    name: 1,
                    photo: 1
                });

            hasUser(matchedUser);

            return {
                status: successType.S02.s200,
                matchedUser: matchedUser
            }
        } catch (err) {
            next(err);
        }
    },
    // 나의 프로필 조회(유저 정보)
    getMyProfile: async userId => {
        try {
            const matchedUser = await User.findOne(
                { _id: userId },
                {
                    email: 1,
                    name: 1,
                    photo: 1
                });

            if (!matchedUser) {
                const error = new Error(errorType.D04.d404);
                throw error;
            }

            const status = successType.S02.s200;

            return {
                matchedUser: matchedUser,
                status: status
            }
        } catch (err) {
            next(err);
        }
    }
}

export default channelService;