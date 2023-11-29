import fetch from 'node-fetch';
import dotenv from 'dotenv';

import { successType, temporaryRedirectType } from '../util/status.js';

dotenv.config();

const kakaoAPI = {
    // 1. 카카오 동의페이지
    getKakaoLoginPageURL: async next => {
        try {
            const response = await fetch(`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile_nickname,profile_image,account_email,gender`, {
                method: 'GET',
            });

            return {
                url: response.url,
                status: temporaryRedirectType.T03.t302
            };
        } catch (err) {
            next(err);
        }
    },
    // 2. 카카오에 토큰 요청
    postRequestTokenToKakao: async (code, next) => {
        try {
            const response = await fetch(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}&code=${code}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const data = await response.json();

            return {
                status: {
                    code: response.status,
                    status: response.statusText,
                    msg: '카카오로부터 응답을 받았습니다.'
                },
                body: data
            };
        } catch (err) {
            next(err);
        }
    },
    // 3. 카카오 유저 정보 조회
    getRequestUserInfoByAccessToken: async (accessToken, next) => {
        try {
            const response = await fetch(`https://kapi.kakao.com/v2/user/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-type': 'application/json'
                }
            });
            const data = await response.json();

            return {
                status: {
                    code: response.status,
                    status: response.statusText,
                    msg: '카카오로부터 응답을 받았습니다.'
                },
                body: data
            };
        } catch (err) {
            next(err);
        }
    }
}

export default kakaoAPI