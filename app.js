import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v4 } from 'uuid';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import hpp from 'hpp';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swagger/config.js';

import SocketIO from './socket.js';
import redisClient from './util/redis.js';
import { errorType } from './util/status.js';
import { errorHandler } from './error/error.js'

import channelRoutes from './routes/channel.js';
import userRoutes from './routes/user.js';
import oauthRoutes from './routes/oauth.js';
import chatRoutes from './routes/chat.js';
import workspaceRoutes from './routes/workspace.js';
import staticDataRoutes from './routes/static-data.js';

dotenv.config();

const app = express();
const swaggerSpec = swaggerJSDoc(swaggerOptions);
console.log(swaggerSpec)
app.use('/soulmate/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 배포 환경 or 개발 환경
let DATABASE_NAME;
if (process.env.NODE_ENV === 'production') {
    console.log('배포 환경!!');
    DATABASE_NAME = process.env.DATABASE_DEFAULT_NAME_PORD_VER;
    app.use(morgan('combined'));
    app.use(
        helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: false
        })
    );
    app.use(hpp());
} else {
    console.log('개발 환경!!');
    DATABASE_NAME = process.env.DATABASE_DEFAULT_NAME_DEV_VER;
    console.log(DATABASE_NAME)
    app.use(morgan('dev'));
}

const DATABASE_URL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.vkqqcqz.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`;

// 정적 file처리를 위한 변수
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// 파싱 미들웨어
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/files', express.static(path.join(__dirname, 'files')));// 파일 폴더를 정적으로 사용
app.use('/images/user_profiles', express.static(path.join(__dirname, 'images/user_profiles')));// 파일 폴더를 정적으로 사용
app.use('/images/channel_thumbnail', express.static(path.join(__dirname, 'images/channel_thumbnail')));// 파일 폴더를 정적으로 사용

//cors에러 해결을 위한 헤더설정
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization', 'RefreshToken');
    next();
});

// 라우트 접근
app.use('/api/v1/channel', channelRoutes);
app.use('/api/v1/static-data', staticDataRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/oauth', oauthRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/workspace', workspaceRoutes);

// 오류 처리
app.use((error, req, res, next) => {
    // console.log('미들웨어 함수 진입.... throw 된 에러: ', error);
    if (!error.statusCode) {
        error = errorHandler(error);
    }

    res.status(error.statusCode || 500).json({
        error: error
    });
});


//몽구스와 연결후 서버 실행
mongoose.connect(DATABASE_URL)
    .then(result => {
        // 서버사이드 웹 소켓
        const server = app.listen(process.env.PORT || 8080, () => console.log(`Node BackEnd Server start!!`));

        const io = SocketIO.init(server);
        io.emit('connection', socket => {
            console.log('백엔드 서버 webSocket 가동!!!');
        });

        // 레디스 연결
        redisClient.connect();
    }).catch(err => {
        console.log('몽구스 오류!!! : ', err);
    });
