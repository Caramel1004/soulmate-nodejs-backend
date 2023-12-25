import kakaoAPI from '../API/kakaoAPI.js';
import userService from '../service/user.js'
import { hasReturnValue } from '../validator/valid.js'

/** -----------------------------------------------------------------------------
 * SNS계정으로 로그인 시 순서도
 * 카카오 로그인 페이지 URL 요청 -> 카카오 API에 해당유저에대한 토큰 요청 -> 카카오 유저 정보 조회
 * 1. 카카오 로그인 페이지 URL 요청
 * 2. 카카오 API에 해당유저에대한 토큰 요청
 * 3. 카카오 API에 유저 정보 조회 -> 가입 o 로그인, 가입 x 회원가입
 *  -----------------------------------------------------------------------------
 */

const oauthController = {
    /** 1. 카카오 로그인 페이지 URL 요청 */
    getKakaoLoginPageURL: async (req, res, next) => {
        try {
            const data = await kakaoAPI.getKakaoLoginPageURL(next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                url: data.url,
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    /** 2. 카카오 API에 해당유저에대한 토큰 요청 */
    getRequestTokenToKakao: async (req, res, next) => {
        try {
            const { code } = req.query;

            const data = await kakaoAPI.getRequestTokenToKakao(code, next);
            hasReturnValue(data);

            console.log(data);
            res.status(data.status.code).json({
                status: data.status,
                body: data.body
            });
        } catch (err) {
            next(err);
        }
    },
    /** 3. 카카오 API에 유저 정보 조회 -> 가입 o 로그인, 가입 x 회원가입 -> 계정 등록 안되있으면 회원가입후 로그인 진행 */
    postSignUpOrLoginBySNSAccount: async (req, res, next) => {
        try {
            console.log('req.body: ', req.body);
            const { company, access_token } = req.body;
            let snsResData;

            if (company === 'kakao') {
                snsResData = await kakaoAPI.getRequestUserInfoByAccessToken(access_token, next);
            } else if (company === 'naver') {

            } else if (company === 'google') {

            }

            hasReturnValue(snsResData);

            const data = await userService.postSignUpOrLoginBySNSAccount(snsResData.body, company, next);

            res.status(data.status.code).json({
                status: data.status,
                token: data.token,
                refreshToken: data.refreshToken,
                name: data.name,
                photo: data.photo,
                channels: data.channels
            });
        } catch (err) {
            next(err);
        }
    }
}

export default oauthController;