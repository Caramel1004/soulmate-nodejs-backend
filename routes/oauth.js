import { Router } from 'express';

import oauthController from '../controller/oauth.js';

const router = Router();

/** -----------------------------------------------------------------------------
 * SNS계정으로 로그인 시 순서도
 * 카카오 로그인 페이지 URL 요청 -> 카카오 API에 해당유저에대한 토큰 요청 -> 카카오 유저 정보 조회
 * 1. 카카오 로그인 페이지 URL 요청
 * 2. 카카오 API에 해당유저에대한 토큰 요청
 * 3. 카카오 API에 유저 정보 조회 -> 가입 o 로그인, 가입 x 회원가입
 *  -----------------------------------------------------------------------------
 */

/** GET /api/v1/oauth/kakao/authorize
 * @method{GET}
 * @route {/api/v1/oauth/kakao/authorize}
 * 1. 카카오 로그인 페이지 URL 요청
*/
router.get('/kakao/authorize', oauthController.getKakaoLoginPageURL);


/** POST /api/v1/oauth/kakao/token
 * @method{POST}
 * @route {/api/v1/oauth/kakao/token}
 * 2. 카카오 API에 해당유저에대한 토큰 요청
*/
router.get('/kakao/token', oauthController.getRequestTokenToKakao);

/** POST /api/v1/oauth/signin
 * @method{POST}
 * @route {/api/v1/oauth/signin}
 * 3. 해당 SNS API에 유저 정보 조회 -> 가입 o 로그인, 가입 x 회원가입
*/
router.post('/signin', oauthController.postSignUpOrLoginBySNSAccount);

export default router

