import { Router } from 'express';
import multer from 'multer';

import filesHandler from '../util/files-handler.js';

import userController from '../controller/user.js';
import { hasJsonWebToken, hasFile } from '../validator/valid.js';


const router = Router();

/**
 * 1. 회원가입
 * 2. 로그인 요청한 유저 조회
 * ------SNS계정으로 로그인 시 순서도------
 * 카카오 로그인 페이지 URL 요청 -> 카카오 API에 해당유저에대한 토큰 요청 -> 카카오 유저 정보 조회
 * 3. 카카오 로그인 페이지 URL 요청
 * 4. 카카오 API에 해당유저에대한 토큰 요청
 * 5. 카카오 API에 유저 정보 조회 -> 가입 o 로그인, 가입 x 회원가입
 */



/** POST /v1/user/signup
 * @method{POST}
 * @route {/v1/user/signup}
 * 1. 회원가입
*/
router.post('/signup',
    multer({ storage: filesHandler.fileStorage, fileFilter: filesHandler.fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).single('photo'),
    filesHandler.saveUploadedUserPhoto,
    userController.postSignUp
);


/** POST /v1/user/login
 * @method{POST}
 * @route {/v1/user/login}
 * 2. 로그인 요청한 유저 조회
*/
router.post('/login', userController.postLogin);// 2. 로그인 요청한 유저 조회


/** -----------------------------------------------------------------------------
 * SNS계정으로 로그인 시 순서도
 * 카카오 로그인 페이지 URL 요청 -> 카카오 API에 해당유저에대한 토큰 요청 -> 카카오 유저 정보 조회
 */

/** GET /v1/user/kakao-account
 * @method{GET}
 * @route {/v1/user/kakao-account}
 * 3. 카카오 로그인 페이지 URL 요청
*/
router.get('/kakao/oauth/authorize', userController.getKakaoLoginPageURL);


/** POST /v1/user/kakao/oauth/token
 * @method{POST}
 * @route {/v1/user/kakao/oauth/token}
 * 4. 카카오 API에 해당유저에대한 토큰 요청
*/
// POST /v1/user/kakao/oauth/token
router.post('/kakao/oauth/token', userController.postRequestTokenToKakao);// 4. 카카오에 토큰 요청


/** POST /v1/user/sns-account/signup
 * @method{POST}
 * @route {/v1/user/sns-account/signup}
 * 5. 카카오 API에 유저 정보 조회 -> 가입 o 로그인, 가입 x 회원가입
*/
router.post('/sns-account/signup', userController.postSignUpOrLoginBySNSAccount);

/** ----------------------------------------------------------------------------- */

/** POST /v1/user/userInfo/:name
 * @method{POST}
 * @route {/v1/user/userInfo/:name}
 * 6. 검색 키워드로 유저 리스트 조회
*/
// POST /v1/user/userInfo/:name
router.post('/userInfo/:name', userController.getSearchUser);


/** GET /v1/user/myprofile
 * @method{GET}
 * @route {/v1/user/myprofile}
 * 7. 내 프로필 조회
*/
// GET /v1/user/myprofile
router.get('/myprofile', hasJsonWebToken, userController.getMyProfile);


/** PATCH /v1/user/edit-myprofile
 * @method{PATCH}
 * @route {/v1/user/edit-myprofile}
 * 8. 내 프로필 수정
*/
// PATCH /v1/user/edit-myprofile
router.patch('/edit-myprofile',
    hasJsonWebToken,
    multer({ storage: filesHandler.fileStorage, fileFilter: filesHandler.fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).array('data', 1),
    userController.patchEditMyProfileByReqUser
);


/** PATCH /v1/user/edit-myprofile-photo
 * @method{PATCH}
 * @route {/v1/user/edit-myprofile-photo}
 * 9. 내 프로필 이미지 수정 
*/
router.patch('/edit-myprofile-photo',
    hasJsonWebToken,
    multer({ storage: filesHandler.fileStorage, fileFilter: filesHandler.fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).array('photo', 1),
    hasFile,
    filesHandler.saveUploadedUserPhoto,
    userController.patchEditMyProfileByReqUser
);

export default router;