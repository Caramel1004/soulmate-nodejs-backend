//응답 성공
export const successType = {
    S02: {
        s200: {
            code: 200,
            status: 'OK',
            msg: '응답 성공했습니다.'
        },
        s201: {
            code: 201,
            status: 'Created',
            msg: '리소스가 생성되었습니다.'
        }
    }
}

//응답 실패(오류)
export const errorType = {
    E04: {
        e400: {
            code: 400,
            status: 'Bad Request',
            msg: '잘못된 게이트 입니다.'
        },
        e401: {
            code: 401,
            status: 'Unauthorized',
            msg: '권한이 없습니다.'
        },
        e404: {
            code: 404,
            status: 'Not Found Data',
            msg: '요구 데이터가 없습니다.'
        },
        e422: {
            code: 422,
            status: 'Unprocessable Entity',
            msg: '요청된 지시를 따를 수 없습니다.'
        }
    },
    E05: {
        e500: {
            code: 500,
            status: 'Internal Server Error',
            msg: '예상치 못한 문제가 발생했습니다.'
        }
    },
    D04: {
        d404: {
            code: 404,
            status: 'Not Found Data',
            msg: '데이터베이스에 일치하는 데이터가 없습니다.'
        }
    }
}