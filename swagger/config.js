const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SOULMATE',
            version: '1.0.0',
            description: '프로젝트: SOULMATE, Nodejs 기반 백엔드 API',
        },
    },
    apis: ['./swagger/*.js'], // files containing annotations as above
}

export default swaggerOptions