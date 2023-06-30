import User from '../models/user.js'
import userService from '../service/user.js'

const userController = {
    //회원가입
    postSignUp: async (req, res, next) => {
        try {
            const body = req.body;
            const resData = await userService.postSignUp(body);//successType

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
            const email = req.body.email;
            const pwd = req.body.password;
            console.log('email: ', email);
            console.log('pwd: ', pwd);

            const resData = await userService.postLogin(email, pwd, next);

            if(!resData) {
                return;
            }

            const token = resData.token;
            const photo = resData.photo;
            const name = resData.name;
            const status = resData.status;

            res.status(status.code).json({
                status: status,
                token: token,
                name: name,
                photo: photo
            });
        } catch (err) {
            next(err);
        }
    },
    // 유저 정보 조회
    getUserInfo: async (req, res, next) => {
        const email = req.params.email;

        const resData = await userService.getUserInfo(email);

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