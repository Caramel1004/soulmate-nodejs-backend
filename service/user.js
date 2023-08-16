import jsonWebToken from '../util/jwt.js'
import Channel from '../models/channel.js';

import { successType, errorType } from '../util/status.js';
import { hasUser, vaildatePasswordOfUser, hasAuthorizationToken, hasExistUserInChannel } from '../validator/valid.js'
import { User, SNS_Account } from '../models/user.js';


const userService = {
    // 1. 회원 가입
    postSignUp: async (body, next) => {
        try {
            const user = new User(body);

            const savedUser = await user.save();

            hasUser(savedUser);

            const status = successType.S02.s201;
            return status;
        } catch (err) {
            next(err);
        }
    },
    // 2. 회원 로그인
    postLogin: async (email, pwd, next) => {
        try {
            const user = await User.findOne({ email: email });

            // 사용자 존재유무 체크
            hasUser(user);

            // 나중에 bcrypt 추가할 예정
            // 비밀번호 일치하는지 체크
            vaildatePasswordOfUser(user.password, pwd);

            // jwt 발급
            const token = await jsonWebToken.signToken(user);

            // 토큰 발급 유무
            hasAuthorizationToken(token);

            return {
                token: token.accessToken,
                refreshToken: token.refreshToken,
                photo: user.photo,
                name: user.name,
                status: successType.S02.s200
            }
        } catch (err) {
            next(err);
        }
    },
    // 3. 유저 정보 조회
    getUserInfo: async (channelId, name, next) => {
        try {
            const matchedUser = await User.findOne(
                { name: name },
                {
                    email: 1,
                    name: 1,
                    photo: 1
                });
            hasUser(matchedUser);

            const matchedChannel = await Channel.findById(channelId).select({ members: 1 });

            // 이미 유저가 참여하고 있는지 확인
            const existUser = matchedChannel.members.find(id => id.toString() === matchedUser._id.toString());
            hasExistUserInChannel(existUser);

            return {
                status: successType.S02.s200,
                matchedUser: matchedUser
            }
        } catch (err) {
            next(err);
        }
    },
    // 나의 프로필 조회(유저 정보)
    getMyProfile: async (userId, next) => {
        try {
            const matchedUser = await User.findOne(
                { _id: userId },
                {
                    email: 1,
                    name: 1,
                    photo: 1,
                    gender: 1,
                    phone: 1,
                    wishChannels: 1
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
    },
    // 5. SNS 계정으로 회원가입 or 로그인
    postSignUpOrLoginBySNSAccount: async (snsResData, next) => {
        try {
            console.log(snsResData)
            // 1. 카카오계정 스키마에서 해당 계정이 있는지 조회
            const hasSocialAccount = await SNS_Account.exists({ id: snsResData.id });
            console.log(hasSocialAccount);
            // 2. 가입이 안되있으면 회원가입 되어있으면 로그인
            let user;
            if (hasSocialAccount) {
                user = await User.findOne({
                    snsConnectedAccount: {
                        account: snsResData.id
                    }
                })
                hasUser(user);
            } else {
                account = await new SNS_Account.create({
                    body: snsResData
                });

                user = await new User.create({
                    email: snsResData.kakao_account || null,
                    name: snsResData.properties.nickname,
                    password: null,
                    photo: snsResData.properties.profile_image,
                    gender: snsResData.kakao_account || null
                });
            }
            
            hasUser(user);

            // jwt 발급
            const token = await jsonWebToken.signToken(user);

            // 토큰 발급 유무
            hasAuthorizationToken(token);

            return {
                status: successType.S02.s200,
                token: token.accessToken,
                refreshToken: token.refreshToken,
                photo: user.photo,
                name: user.name
            }
        } catch (err) {
            next(err);
        }
    },
}

export default userService;