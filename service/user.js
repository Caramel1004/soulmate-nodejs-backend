import jwt from 'jsonwebtoken';

import Channel from '../models/channel.js';
import User from '../models/user.js';
import { ChatRoom } from '../models/chat-room.js';

import { successType, errorType } from '../util/status.js';


const channelService = {
    // 회원 가입
    postSignUp: async (req, next) => {
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
            const status = successType.S02.s201;
            return status;
        } catch (err) {
            throw err;
        }
    },
    //회원 로그인
    postLogin: async (clientId, pwd) => {
        try {
            const user = await User.findOne({ clientId: clientId });

            console.log(user);
            // 사용자 존재유무 체크
            if (!user) {
                const errReport = errorType.D04.d404;
                const error = new Error(errReport);
                throw error;
            }

            // 나중에 bcrypt 추가할 예정
            // 비밀번호 일치하는지 체크
            if (user.password !== pwd.toString()) {
                const errReport = errorType.D04.d404;
                errReport.msg = '비밀번호가 일치하지 않습니다.';
                const error = new Error(errReport);
                throw error;
            }

            // jwt 발급
            const token = jwt.sign({
                userId: user._id
            },
                'caramel',
                { expiresIn: '2h' }
            );


            // 토큰 발급 유무
            if (!token) {
                const errReport = errorType.E04.e422;
                errReport.msg = '토큰이 부여되지 않았습니다!!';
                const error = new Error(errReport);
                throw error;
            }

            console.log('token 발급: ', token);

            return {
                token: token,
                photo: user.photo,
                status: successType.S02.s200
            }
        } catch (err) {
            throw err;
        }
    },
    // 유저 정보 조회
    getUserInfo: async clientId => {
        try {
            const matchedUser = await User.findOne(
                { clientId: clientId },
                {
                    _id: 1,
                    clientId: 1,
                    name: 1,
                    photo: 1
                });

            let status;

            if (!matchedUser) {
                status = errorType.D04.d404
                status.msg = '존재하지 않는 유저 입니다.'
            } else {
                status = successType.S02.s200;
                status.msg = '유저를 찾았습니다.';
            }

            return {
                status: status,
                matchedUser: matchedUser
            }
        } catch (err) {
            throw err;
        }
    },
    // 나의 프로필 조회(유저 정보)
    getMyProfile: async userId => {
        try {
            const matchedUser = await User.findOne(
                { _id: userId },
                {
                    clientId: 1,
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
            throw err;
        }
    }
}

export default channelService;