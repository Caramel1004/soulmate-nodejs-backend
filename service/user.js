import bcrypt from 'bcryptjs';

import Channel from '../models/channel.js';
import { User, SNS_Account } from '../models/user.js';

import db from '../util/transaction.js'
import jsonWebToken from '../util/jwt.js'
import { successType, errorType } from '../util/status.js';
import { hasUser, hasUserInDB, vaildatePasswordOfUser, hasAuthorizationToken, hasExistUserInChannel } from '../validator/valid.js'
import filesS3Handler from '../util/files-s3-handler.js';

/**
 * 1. 회원가입
 * 2. 로그인 요청한 유저 조회
 */

const userService = {
    // 1. 회원 가입
    postSignUp: async (body, next) => {
        try {
            // 중복 이메일 체크
            const hasUseInDB = await User.exists({ email: body.email });

            hasUserInDB(hasUseInDB);

            body.photo = body.fileUrls[0];
            const user = new User(body);

            const savedUser = await user.save();

            hasUser(savedUser);

            return {
                status: successType.S02.s201
            };
        } catch (err) {
            err.path = 'email';
            next(err);
        }
    },
    // 2. 회원 로그인
    postLogin: async (email, pwd, next) => {
        try {
            const user = await User.findOne({ email: email })
                .populate('channels', {
                    channelName: 1,
                    thumbnail: 1
                });

            // 사용자 존재유무 체크
            hasUser(user);

            // 나중에 bcrypt 추가할 예정s
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
                channels: user.channels,
                status: successType.S02.s200
            }
        } catch (err) {
            next(err);
        }
    },
    // 3. 검색 키워드에따른 유저 리스트 조회
    getSearchUserByKeyWord: async (channelId, name, next) => {
        try {
            const matchedUsers = await User.find(
                { name: { $regex: name, $options: 'i' } },
                {
                    name: 1,
                    photo: 1
                });

            const matchedChannel = await Channel.findById(channelId).select({ members: 1 });
            console.log(matchedChannel)
            // 이미 유저가 참여하고 있는지 확인
            matchedUsers.map(user => {
                const isChannelMember = matchedChannel.members.includes(user._id.toString());
                if (isChannelMember) {
                    user._doc.isChannelMember = true;// 채널 멤버에 속함
                } else {
                    user._doc.isChannelMember = false;// 채널 멤버 아님
                }
                return user;
            });
            
            return {
                status: successType.S02.s200,
                matchedUsers: matchedUsers
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
    postSignUpOrLoginBySNSAccount: async (snsResData, company, next) => {
        try {
            console.log(snsResData)
            // 1. 카카오계정 스키마에서 해당 계정이 있는지 조회
            const snsAccount = await SNS_Account.findOne({ id: snsResData.id });
            console.log('snsAccount: ', snsAccount);
            // 2. 가입이 안되있으면 회원가입 되어있으면 로그인
            let user;
            if (snsAccount) {
                user = await User.findOne({ password: snsResData.id });
                if (!user) {
                    await SNS_Account.deleteOne({ id: snsResData.id })
                }
            } else {
                const account = await SNS_Account.create({
                    id: snsResData.id,
                    company: company,
                    body: snsResData
                });
                console.log('account: ', account)
                user = await User.create({
                    email: snsResData.kakao_account.email || null,
                    name: snsResData.properties.nickname,
                    password: snsResData.id,
                    photo: snsResData.properties.profile_image,
                    gender: snsResData.kakao_account.gender || null,
                    snsConnectedAccount: {
                        company: company,
                        account: account._id
                    }
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
            console.log(err);
            next(err);
        }
    },
    patchEditMyProfileByReqUser: async (userId, body, next) => {
        try {
            const { hasNameToBeEdit, hasPhotoToBeEdit, hasPhoneToBeEdit, data } = body;

            // 1. 유저 존재 여부
            const user = await User.findById(userId).select({ _id: 1, photo: 1 });
            hasUser(user);

            const updatedData = {
                hasNameToBeEdit: hasNameToBeEdit,
                hasPhotoToBeEdit: hasPhotoToBeEdit,
                hasPhoneToBeEdit: hasPhoneToBeEdit
            };

            switch ('true') {
                case hasNameToBeEdit: await User.updateOne({ _id: userId }, { name: data });
                    updatedData.data = data;
                    break;
                case hasPhotoToBeEdit:
                    await filesS3Handler.deletePhotoList([user.photo]);
                    await User.updateOne({ _id: userId }, { photo: body.fileUrls[0] });
                    updatedData.photo = body.fileUrls[0];
                    break;
                case hasPhoneToBeEdit: await User.updateOne({ _id: userId }, { phone: data });
                    updatedData.data = data;
                    break;
            }
            console.log('updatedData: ', updatedData);
            return {
                status: successType.S02.s200,
                updatedData: updatedData
            }
        } catch (err) {
            next(err)
        }
    },
}

export default userService;