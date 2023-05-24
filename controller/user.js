import User from '../models/user.js'
import jwt from 'jsonwebtoken';

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
    postLogin: async (req, res, next) => {
        try {
            const clientId = req.body.clientId;
            const pwd = req.body.password;
            console.log('clientId: ', clientId);
            console.log('pwd: ', pwd);

            const user = await User.findOne({ clientId: clientId });

            // 사용자 존재유무 체크
            if (!user) {
                const error = new Error('사용자 정보가 없습니다.');
                error.statusCode = 401;
                throw error;
            }
            console.log('user: ', user);
            console.log('user.password: ', user.password);

            // 나중에 bcrypt 추가할 예정
            // 비밀번호 일치하는지 체크
            if (user.password !== pwd.toString()) {
                const error = new Error('비밀번호가 일치하지 않습니다.');
                error.statusCode = 401;
                throw error;
            }

            // jwt 발급
            const token = jwt.sign({
                clientId: user.clientId,
                userId: user._id
            },
                'caramel',
                { expiresIn: '1h' }
            );

            console.log('로그인 인증 token: ', token);

            // 토큰 발급 유무
            if (!token) {
                const error = new Error('토큰이 부여되지 않았습니다!!');
                error.statusCode = 422;
                throw error;
            } else {
                res.status(201).json({
                    token: token,
                    userId: user._id
                });
            }
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 유저 정보 가져오기
    getUserInfo: async (req,res,next) => {
        const reqUserId = req.userId;
        const clientId = req.body.clientId;

        const matchedUser = await User.findOne({clientId: clientId});

        res.status(200).json({
            msg: '유저를 찾았습니다.',
            user: matchedUser
        });
    }
}

export default userController;