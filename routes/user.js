import { Router } from 'express';
import userController from '../controller/user.js';
import { hasJsonWebToken } from '../validator/valid.js';

const router = Router();

// POST /v1/user/signup
router.post('/signup', userController.postSignUp);// 1. 회원가입

// POST /v1/user/login
router.post('/login', userController.postLogin);// 2. 로그인 요청한 유저 조회

// GET /v1/user/kakao-account
router.get('/kakao/oauth/authorize', userController.getKakaoLoginPageURL);// 3. 카카오 로그인 페이지 URL get

// POST /v1/user/kakao/oauth/token
router.post('/kakao/oauth/token', userController.postRequestTokenToKakao);// 4. 카카오에 토큰 요청

// POST /v1/user/kakao-account/signup
router.post('/sns-account/signup', userController.postSignUpOrLoginBySNSAccount);// 5. 카카오 유저 정보 조회 -> 1. 회원가입

// POST /v1/user/userInfo/:name
router.post('/userInfo/:name', userController.getUserInfo);// 3. 유저 조회

// GET /v1/user/myprofile
router.get('/myprofile', hasJsonWebToken, userController.getMyProfile);

// PATCH /v1/user/edit-myprofile
router.patch('/edit-myprofile', hasJsonWebToken, userController.patchEditMyProfileByReqUser);

export default router;