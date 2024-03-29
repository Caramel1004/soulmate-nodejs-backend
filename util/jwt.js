import jwt from 'jsonwebtoken';
import redisClient from './redis.js';
import { VerificationTokenError } from '../error/error.js';


export default {
    signToken: async user => {
        try {
            // 해당 유저의 기존 리프레쉬 토큰 삭제
            if(await redisClient.v4.exists(user._id.toString()) == 1){
                console.log('레디스에 잉여 데이터 존재!');
                await redisClient.v4.del(user._id.toString());
            }
            
            // 페이로드
            const payload = {
                userId: user._id
            }

            // 토큰 생성
            const accessToken = jwt.sign(payload, process.env.JWT_ACCESSTOKEN_SECRETKEY, {
                algorithm: 'HS256',
                expiresIn: '1h'
            });

            // access token안에 페이로드에 유저정보를 저장하기떄문에 인증만료가 되었어도 정보는 들어있기때문에 리프레쉬 토큰에는 빈 페이로드로 저장
            const refreshToken = jwt.sign({}, process.env.JWT_REFRESHTOKEN_SECRETKEY, {
                algorithm: 'HS256',
                expiresIn: '14d'
            });

            //set(key,value) 키값을 유저 doc 아이디로 저장
            //refreshToken을 redis에 저장 관리
            const result = await redisClient.v4.set(user._id.toString(), refreshToken);
            console.log('Redis에 리프레쉬 토큰 저장 완료: ', result)

            return {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        } catch (err) {
            throw err;
        }
    },
    // 인증 토큰 검증 함수
    verifyAuthorizaionToken: async (accessToken, refreshToken) => {
        let hasNewAccessToken = false;
        try {
            // 1. 인증토큰이 만료가 안되었다면 디코딩된 토큰 리턴
            const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESSTOKEN_SECRETKEY);
            return {
                decodedToken: decodedToken,
                authStatus: {
                    hasNewAccessToken: hasNewAccessToken,
                    newAccessToken: null
                }
            };
        } catch (err) {// 검증과정에서 문제 발생시 에러캣치
            // 2. 에러 사유가 인증 토큰 만료라면 리프레시 토큰 검증 
            if (err.name === 'TokenExpiredError') {
                console.log('리프레시 토큰 검사 중!!');
                const decodedToken = jwt.decode(accessToken);
                try {
                    const savedToken = await redisClient.v4.get(decodedToken.userId);// 레디스에서 해당 키에 대한 값 가져오기
                    console.log('savedToken: ', savedToken);
                    console.log('refreshToken: ', refreshToken);
                    if (savedToken === refreshToken) {
                        const result = jwt.verify(refreshToken, process.env.JWT_REFRESHTOKEN_SECRETKEY);
                        console.log('result: ', result);
                        if (result) {
                            // 토큰 생성
                            const newAccessToken = jwt.sign({ userId: decodedToken.userId }, process.env.JWT_ACCESSTOKEN_SECRETKEY, {
                                algorithm: 'HS256',
                                expiresIn: '1h'
                            });
                            hasNewAccessToken = true
                            console.log('newAccessToken: ', newAccessToken);

                            return {
                                decodedToken: decodedToken,
                                authStatus: {
                                    hasNewAccessToken: hasNewAccessToken,
                                    newAccessToken: newAccessToken
                                }
                            };
                        }
                    } else {
                        throw new VerificationTokenError('Redis에 일치하는 리프레시 토큰이 없습니다.');
                    }
                } catch (err) {
                    const result = await redisClient.v4.del(decodedToken.userId);
                    console.log('레디스 데이터 삭제: ', result);
                    console.log('리프레쉬 토큰 만료!!');
                    // 인증토큰 리프레시토큰 둘다 만료 되었다면 로그인 최종 에러 던짐
                    throw new VerificationTokenError('RefreshToken이 만료 되었습니다. 다시 로그인 하세요.');
                }
            }
        }
    }
}