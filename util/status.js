export const successType = {
    S02: {
        s00: {
            code: 200,
            status: 'OK',
            msg: '응답 성공했습니다.'
        },
        s01: {
            code: 201,
            status: 'Created',
            msg: '리소스가 생성되었습니다.'
        }
    }
}

export const errorType = {
    E04: {
        e00: {
            code: 400,
            status: 'Bad Request',
            msg: '잘못된 게이트 입니다.'
        },
        e01: {
            code: 401,
            status: 'Unauthorized',
            msg: '권한이 없습니다.'
        }
    },
    E05: {
        e00: {
            code: 500,
            status: 'Internal Server Error',
            msg: '예상치 못한 문제가 발생했습니다.'
        }
    },
    D: {
        D04: {
            code: 404,
            status: 'Not Found Data',
            msg: '데이터베이스에 일치하는 데이터가 없습니다.'
        }
    }
}