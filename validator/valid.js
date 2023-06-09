import jwt from 'jsonwebtoken';

import { AuthorizationTokenError, VerificationTokenError, NotFoundDataError, ValidationError } from '../error/error.js'
import { errorType } from '../util/status.js';

// jwt 존재 유무
export function hasJsonWebToken(req, res, next) {
    try {
        // req.get () 함수는 대소문자를 구분하지 않는 지정된 HTTP 요청 헤더 필드를 반환하며 Referrer 및 Referrer 필드는 상호 교환 가능합니다. 
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            throw new AuthorizationTokenError('유효한 인증 토큰이 없습니다.\n다시 로그인 해주세요.');
        }

        const token = authHeader.split(' ')[1];

        // 검증 과정에서 인증만료, 시크릿키값 등 오류 발생처리
        const decodedToken = jwt.verify(token, 'caramel');

        // 만약에 없는 경우가 발생할수있으니 에러 처리
        if (!decodedToken) {
            throw new AuthorizationTokenError('인증 토큰이 유실되었습니다.');
        }

        req.userId = decodedToken.userId;
        next();
    } catch (err) {
        console.error('err: ', err);
        if (!err.statusCode) {
            next(new VerificationTokenError(err));
        }
        next(err);
    }
}

// 채팅 내용 유무
export function hasChat(req, res, next) {
    try {
        if (req.body.chat == undefined || req.body.chat == null || req.body.chat == "") {
            throw new ValidationError('요구된 채팅 내용이 없습니다.');
        }
        next();
    } catch (error) {
        next(error);
    }
}

// 파일 유무
export function hasFile(req, res, next) {
    try {
        if (!req.file) {
            throw new ValidationError('요구된 파일이 없습니다.');
        }
        console.log('req.file');
        const fileUrl = req.file.path.replace('\\', '/');
        req.body.fileUrl = fileUrl;

        console.log(fileUrl);

        next();
    } catch (error) {
        next(error);
    }
}

export const hasArrayChannel = channels => {
    if (!channels) {
        throw new NotFoundDataError('채널을 담는 배열이 존재하지 않습니다.');
    }
    return;
}

export const hasChannelDetail = channelDetail => {
    if (!channelDetail) {
        throw new NotFoundDataError('채널 세부 정보가 존재하지 않습니다.');
    }
    return;
}

export const hasChatRoom = channelDetail => {
    if (!channelDetail) {
        throw new NotFoundDataError('대화방이 존재하지 않습니다.');
    }
    return;
}

export const hasUser = user => {
    if (!user) {
        throw new NotFoundDataError('일치하는 유저가 존재하지 않습니다.');
    }
    return;
}

export const vaildatePasswordOfUser = (userPassword, reqPassword) => {
    if (userPassword !== reqPassword) {
        throw new ValidationError('요청하신 비밀번호와 유저의 비밀번호가 일치하지 않습니다.')
    }
    console.log('비밀번호 일치');
    return;
}

export const hasAuthorizationToken = token => {
    if (!token) {
        throw new AuthorizationTokenError('인증 토큰이 부여되지 않았습니다.');
    }
    return;
}

export const hasReturnValue = data => {
    if(!data) {
        throw new NotFoundDataError('응답받은 데이터가 없습니다.');
    }
}

export const hasCategoryData = data => {
    if(!data) {
        throw new NotFoundDataError('카테고리 데이터가 없습니다.');
    }
}