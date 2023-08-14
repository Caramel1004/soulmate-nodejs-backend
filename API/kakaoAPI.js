import fetch from 'node-fetch';
import { successType, temporaryRedirectType} from '../util/status.js';

const kakaoAPI = {
    // 1. 카카오 동의페이지
    getKakaoLoginPageURL: async next => {
        try {
            const response = await fetch(`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile_nickname,profile_image,account_email,gender`,{
                method: 'GET',
            });

            console.log(response);
            return {
                url: response.url,
                status: temporaryRedirectType.T03.t302
            };
        } catch (err) {
            next(err);
        }
    },
    // 4. 카카오 토큰 받기
    postRequestTokenToKakao: async (code, next) => {
        try {
            const response = await fetch(`https://kauth.kakao.com/oauth/token`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    grant_type: code,
                    client_id: process.env.KAKAO_REST_API_KEY,
                    redirect_uri: process.env.REDIRECT_URI,
                    code: code
                }
            });
            const data = await response.json();

            return {
                status: {
                    code: response.status,
                    status: response.statusText,
                    msg: '카카오로부터 인증 실패'
                },
                body: data
            };
        } catch (err) {
            next(err);
        }
    }
}

export default kakaoAPI