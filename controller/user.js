import userService from '../service/user.js'

import { hasReturnValue } from '../validator/valid.js'

/**
 * 1. 회원가입
 * 2. 로그인 요청한 유저 조회
 * 3. 검색 키워드로 유저 리스트 조회
 * 4. 내 프로필 조회
 * 5. 내 프로필 수정
 * 6. 내 프로필 이미지 수정
 * 7. 앱에서 회원 탈퇴
 */

const userController = {
    /** 1. 회원가입 */
    postSignUp: async (req, res, next) => {
        try {
            const body = req.body;
            const data = await userService.postSignUp(body, next);//successType
            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status
            })
        } catch (err) {
            next(err);
        }
    },
    /** 2. 로그인 요청한 유저 조회 */
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
    /** 3. 검색 키워드로 유저 리스트 조회 */
    getSearchUserByKeyWord: async (req, res, next) => {
        try {
            const name = req.params.name;
            const { channelId } = req.body;
            console.log(name);
            const data = await userService.getSearchUserByKeyWord(channelId, name, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                users: data.matchedUsers
            });
        } catch (err) {
            next(err)
        }
    },
    /** 4. 내 프로필 조회 */
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
    /** 5., 6. 내 프로필 수정 */
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
    /** 7. 앱에서 회원 탈퇴 */
    deleteUserToApp: async (req, res, next) => {
        const { userId, authStatus } = req.user;

        const data = await userService.deleteUserToApp(userId, body, next);
        hasReturnValue(data);

        res.status(data.status.code).json({
            authStatus: authStatus,
            status: data.status,
            updatedData: data.updatedData
        });
    }
}

export default userController;