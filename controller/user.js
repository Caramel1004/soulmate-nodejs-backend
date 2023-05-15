import User from '../models/user.js'

const userController = {
    //회원가입
    postSignUp: async (req, res, next) => {
        try {
            const clientId = req.body.clientId;
            const name = req.body.name;
            const password = req.body.password;

            const user = new User({
                clientId: clientId,
                name: name,
                password: password
            });

            await user.save();

            res.status(201).json({
                msg: '유저가 생성 되었습니다.',
                user: user
            })
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    //회원 로그인
    postLogin: (req, res, next) => {

    }
}

export default userController;