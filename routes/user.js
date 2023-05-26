import { Router } from 'express';
import userController from '../controller/user.js';

const router = Router();


// POST /v1/user/check
router.post('/check', userController.postLogin);

//POST /v1/user/signup
router.post('/signup', userController.postSignUp);

//GET /v1/user/userInfo:/clientId
router.get('/userInfo/:clientId', userController.getUserInfo);

export default router;