import kakaoAPI from '../API/kakaoAPI.js';
import userService from '../service/user.js'

import { hasReturnValue } from '../validator/valid.js'

const userController = {
    // 1. 회원가입
    postSignUp: async (req, res, next) => {
        try {
            const body = req.body;
            const data = await userService.postSignUp(body, next);//successType

            res.status(data.code).json({
                data: data
            })
        } catch (err) {
            next(err);
        }
    },
    // 2. 회원 로그인
    postLogin: async (req, res, next) => {
        try {
            const email = req.body.email;
            const pwd = req.body.password;

            const data = await userService.postLogin(email, pwd, next);

            hasReturnValue(data);

            const token = data.token;
            const refreshToken = data.refreshToken;
            const photo = data.photo;
            const name = data.name;
            const channels = data.channels;
            const status = data.status;

            res.status(status.code).json({
                status: status,
                token: token,
                refreshToken: refreshToken,
                name: name,
                photo: photo,
                channels: channels
            });
        } catch (err) {
            next(err);
        }
    },
    // 3. 카카오 로그인 페이지 URL 
    getKakaoLoginPageURL: async (req, res, next) => {
        try {
            const data = await kakaoAPI.getKakaoLoginPageURL(next);
            hasReturnValue(data);

            console.log(data);
            res.status(data.status.code).json({
                url: data.url,
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    // 4. 카카오에 토큰 요청
    postRequestTokenToKakao: async (req, res, next) => {
        try {
            const { code } = req.body;

            const data = await kakaoAPI.postRequestTokenToKakao(code, next);
            hasReturnValue(data);

            console.log(data);
            res.status(data.status.code).json({
                status: data.status,
                body: data.body
            });
        } catch (err) {
            next(err);
        }
    },
    // 5. 카카오 계정으로 회원가입 or 로그인 -> 계정 등록 안되있으면 회원가입후 로그인 진행
    postSignUpOrLoginBySNSAccount: async (req, res, next) => {
        try {
            console.log('req.body: ', req.body);
            const { company } = req.body;
            let snsResData;

            if (company === 'kakao') {
                snsResData = await kakaoAPI.getRequestUserInfoByAccessToken(req.body.access_token, next);
            } else if (company === 'naver') {

            } else if (company === 'google') {

            }

            hasReturnValue(snsResData);

            const data = await userService.postSignUpOrLoginBySNSAccount(snsResData.body, company, next);

            res.status(data.status.code).json({
                status: data.status,
                token: data.token,
                refreshToken: data.refreshToken,
                name: data.name,
                photo: data.photo
            });
        } catch (err) {
            next(err);
        }
    },
    // 3. 유저 정보 조회
    getUserInfo: async (req, res, next) => {
        try {
            const name = req.params.name;
            console.log(name)
            const channelId = req.body.channelId;

            const data = await userService.getUserInfo(channelId, name, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                user: data.matchedUser
            });
        } catch (err) {
            next(err)
        }
    },
    // 나의 프로필 조회(유저 정보)
    getMyProfile: async (req, res, next) => {
        const { userId, authStatus } = req.user

        const data = await userService.getMyProfile(userId, next);
        hasReturnValue(data);

        res.status(data.status.code).json({
            authStatus: authStatus,
            status: data.status,
            matchedUser: data.matchedUser
        });
    },
    patchEditMyProfileByReqUser: async (req, res, next) => {
        const { body } = req;
        const { userId, authStatus } = req.user;

        const data = await userService.patchEditMyProfileByReqUser(userId, body, next);
        hasReturnValue(data);

        res.status(data.status.code).json({
            authStatus: authStatus,
            status: data.status,
            updatedData: data.updatedData
        });
    },
}

export default userController;