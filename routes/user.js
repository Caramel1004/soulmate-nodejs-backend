import { Router } from 'express';
import userController from '../controller/user.js';
import { hasJsonWebToken } from '../validator/valid.js';

const router = Router();

//POST /v1/user/signup
router.post('/signup', userController.postSignUp);// 1. 회원가입

// POST /v1/user/login
router.post('/login', userController.postLogin);// 2. 로그인 요청한 유저 조회

//GET /v1/user/kakao-account
router.get('/kakao-account', userController.getKakaoAccountPage);

//GET /v1/user/userInfo/:name
router.post('/userInfo/:name', userController.getUserInfo);// 3. 유저 조회

//GET /v1/user/myprofile
router.get('/myprofile', hasJsonWebToken, userController.getMyProfile);

export default router;