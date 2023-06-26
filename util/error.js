import { errorType } from '../util/status.js'

class ErrorType {
    constructor(errorType, detailMessage) {
        this.code = errorType.code;
        this.status = errorType.status;
        this.message = errorType.msg;
        this.detailMessage = detailMessage;
    }

    getErrorReport = () => {
        const error = new Error(this.message);
        const errorType = {
            code: this.code,
            status: this.status,
            msg: this.message,
            detailMsg: this.detailMessage
        }
        error.errorType = errorType;
        return error;
    }
}

export const channelError = {
    hasChannelDetail: channelDetail => {
        if (!channelDetail) {
            throw new ErrorType(errorType.D04.d404, '채널 세부 정보가 존재하지 않습니다.');
        }
    }
}