import jwt from 'jsonwebtoken';

import { errorType } from '../util/status.js';

// jwt 존재 유무
export function hasJsonWebToken(req, res, next) {
    // req.get () 함수는 대소문자를 구분하지 않는 지정된 HTTP 요청 헤더 필드를 반환하며 Referrer 및 Referrer 필드는 상호 교환 가능합니다. 
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error = new Error(errorType.E04.e401);
        throw error;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, 'caramel');
        req.userId = decodedToken.userId;
        next();
    } catch (err) {
        err.errReport = errorType.E04.e401;
        err.errReport.msg = '인증 토큰이 만료 되었습니다.';
        throw err;
    }
}

// 채팅 내용 유무
export function hasChat (req, res, next) {
    if(!req.body.chat) {
        console.log('채팅 내용이 없음');
        const error = new Error(errorType.E04.e404);
        throw error;
    }
    next();
}
// 파일 유무
export function hasFile (req, res, next) {
    if(!req.file) {
        const error = new Error(errorType.E04.e404);
        throw error;
    }
    next();
}