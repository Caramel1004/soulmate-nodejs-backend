import { Buffer } from 'node:buffer'
import fs from 'fs';

import jsonWebToken from '../util/jwt.js'

import { AuthorizationTokenError, VerificationTokenError, NotFoundDataError, ValidationError, ValidationExistDataError } from '../error/error.js'
import { errorType } from '../util/status.js';

// jwt 존재 유무
export const hasJsonWebToken = async (req, res, next) => {
    try {
        // req.get () 함수는 대소문자를 구분하지 않는 지정된 HTTP 요청 헤더 필드를 반환하며 Referrer 및 Referrer 필드는 상호 교환 가능합니다. 
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            throw new AuthorizationTokenError('유효한 인증 토큰이 없습니다.\n다시 로그인 해주세요.');
        }

        const accessToken = authHeader.split(' ')[1];
        const refreshToken = req.headers.refresh;

        const data = await jsonWebToken.verifyAuthorizaionToken(accessToken, refreshToken);

        req.user = {
            userId: data.decodedToken.userId,
            authStatus: data.authStatus
        }
        req.userId = data.decodedToken.userId;

        next();
    } catch (err) {
        next(new VerificationTokenError(err));
    }
}

// 채팅 내용 유무
export function hasChat(req, res, next) {
    try {
        if ((req.body.chat == undefined || req.body.chat == null || req.body.chat == "") && (!req.body.files)) {
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
        console.log(req.body)
        if (!req.body.files && !req.body.photo && !req.body.thumbnail) {
            throw new ValidationError('요구된 파일이 없습니다.');
        }
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
export const hasWorkSpace = workSpace => {
    if (!workSpace) {
        throw new NotFoundDataError('워크스페이스가 존재하지 않습니다.');
    }
    return;
}

export const hasPost = post => {
    if (!post) {
        throw new NotFoundDataError('게시물이 존재하지 않습니다.')
    }
    return;
}
export const hasReply = hasReply => {
    if (!hasReply) {
        throw new NotFoundDataError('댓글이 존재하지 않습니다.')
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
        throw new ValidationError('요청하신 이메일과 비밀번호가 일치하는 회원이 없습니다.');
    }
    return;
}

export const hasAuthorizationToken = token => {
    if (!token) {
        throw new AuthorizationTokenError('인증 토큰이 부여되지 않았습니다.');
    }
    return;
}

export const hasReturnValue = data => {
    if (!data) {
        throw new NotFoundDataError('응답받은 데이터가 없습니다.');
    }
    return;
}

export const hasCategoryData = data => {
    if (!data) {
        throw new NotFoundDataError('카테고리 데이터가 없습니다.');
    }
    return;
}

export const hasExistUserInChannel = data => {
    if (data) {
        throw new ValidationExistDataError('해당 유저는 이미 채널에 참여하고 있습니다.');
    }
    return;
}
export const hasExistWishChannel = data => {
    if (data) {
        throw new ValidationExistDataError('해당 오픈 채널은 이미 추가 되어있습니다.')
    }
    return;
}