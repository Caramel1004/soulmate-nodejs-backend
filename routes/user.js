import { Router } from 'express';
import multer from 'multer';

import filesS3Handler from '../util/files-s3-handler.js';

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



/** POST /api/v1/user/signup
 * @method{POST}
 * @route {/api/v1/user/signup}
 * 1. 회원가입
*/
router.post('/signup',
    multer({ limits: { fieldSize: 25 * 1024 * 1024 } }).array('photo', 1),
    filesS3Handler.uploadUserPhotoToS3,
    userController.postSignUp
);


/** POST /api/v1/user/login
 * @method{POST}
 * @route {/api/v1/user/login}
 * 2. 로그인 요청한 유저 조회
*/
router.post('/login', userController.postLogin);// 2. 로그인 요청한 유저 조회


/** POST /api/v1/user/search/:name
 * @method{POST}
 * @route {/api/v1/user/userInfo/:name}
 * 3. 검색 키워드로 유저 리스트 조회
*/
router.post('/search/:name', userController.getSearchUserByKeyWord);


/** GET /api/v1/user/myprofile
 * @method{GET}
 * @route {/api/v1/user/myprofile}
 * 4. 내 프로필 조회
*/
router.get('/myprofile', hasJsonWebToken, userController.getMyProfile);


/** PATCH /api/v1/user/edit-myprofile
 * @method{PATCH}
 * @route {/api/v1/user/edit-myprofile}
 * 5. 내 프로필 수정
*/
router.patch('/edit-myprofile',
    hasJsonWebToken,
    multer().array('data', 1),
    userController.patchEditMyProfileByReqUser
);


/** PATCH /api/v1/user/edit-myprofile-photo
 * @method{PATCH}
 * @route {/api/v1/user/edit-myprofile-photo}
 * 6. 내 프로필 이미지 수정 
*/
router.patch('/edit-myprofile-photo',
    hasJsonWebToken,
    multer({ limits: { fieldSize: 25 * 1024 * 1024 } }).single('photo'),
    hasFile,
    filesS3Handler.uploadUserPhotoToS3,
    userController.patchEditMyProfileByReqUser
);

export default router;