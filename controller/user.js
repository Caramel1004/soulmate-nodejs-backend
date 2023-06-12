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
                token: token,
                clientId: clientId,
                photo: photo
            });

        } catch (err) {
            throw err;
        }
    },
    // 유저 정보 가져오기
    getUserInfo: async (req, res, next) => {
        const clientId = req.params.clientId;

        const matchedUser = await User.findOne(
            { clientId: clientId },
            {
                _id: 1,
                clientId: 1,
                name: 1,
                photo: 1
            });

        console.log('matchedUser: ', matchedUser);
        if (matchedUser === null) {
            res.status(404).json({
                statusCode: 404,
                msg: '존재하지 않는 유저 입니다.',
            });
        } else {
            res.status(200).json({
                statusCode: 200,
                msg: '유저를 찾았습니다.',
                user: matchedUser
            });
        }

    }
}

export default userController;