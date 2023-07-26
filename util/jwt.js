import jwt from 'jsonwebtoken';
import redis from 'redis';

export default {
    signToken: async user => {
        try {
            // 페이로드
            const payload = {
                userId: user._id
            }
            // 암호키
            const secretKey = 'caramel'

            // 토큰 생성
            const accessToken = jwt.sign(payload, secretKey, {
                algorithm: 'HS256',
                expiresIn: '1h'
            });

            // access token안에 페이로드에 유저정보를 저장하기떄문에 인증만료가 되었어도 정보는 들어있기때문에 리프레쉬 토큰에는 빈 페이로드로 저장
            const refreshToken = jwt.sign({}, secretKey, {
                algorithm: 'HS256',
                expiresIn: '1d'
            });

            return {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        } catch (err) {
            throw err;
        }
    },
    verifyAuthorizaionToken: async (accessToken, refreshToken) => {
        try {
            const decodedToken = jsonWebToken.verify(accessToken);
            return decodedToken;
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                try {
                    jsonWebToken.verify(refreshToken);
                
                    return jsonWebToken.decode(accessToken);
                } catch (err) {
                    throw err;
                }
            }
        }
    }
}