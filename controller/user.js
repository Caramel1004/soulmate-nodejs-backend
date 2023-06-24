import User from '../models/user.js'
import userService from '../service/user.js'

const userController = {
    //회원가입
    postSignUp: async (req, res, next) => {
        try {
            const resData = await userService.postSignUp(req, next);//successType

            res.status(resData.code).json({
                resData: resData
            })
        } catch (err) {
            throw err;
        }
    },
    //회원 로그인
    postLogin: async (req, res, next) => {
        try {
            const clientId = req.body.clientId;
            const pwd = req.body.password;
            // console.log('clientId: ', clientId);
            // console.log('pwd: ', pwd);

            const resData = await userService.postLogin(clientId, pwd);

            const token = resData.token;
            const photo = resData.photo;
            const status = resData.status;

            res.status(status.code).json({
                status: status,
                token: token,
                clientId: clientId,
                photo: photo
            });

        } catch (err) {
            throw err;
        }
    },
    // 유저 정보 조회
    getUserInfo: async (req, res, next) => {
        const clientId = req.params.clientId;

        const resData = await userService.getUserInfo(clientId);

        res.status(resData.status.code).json({
            status: resData.status,
            matchedUser: resData.matchedUser
        });
    },
    // 나의 프로필 조회(유저 정보)
    getMyProfile: async (req, res, next) => {
        const userId = req.userId;

        const resData = await userService.getMyProfile(userId);

        res.status(resData.status.code).json({
            status: resData.status,
            matchedUser: resData.matchedUser
        });
    }
}

export default userController;