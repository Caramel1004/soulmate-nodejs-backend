import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v4 } from 'uuid';
import morgan from 'morgan';
import dotenv from 'dotenv';

import SocketIO from './socket.js';
import redisClient from './util/redis.js';
import { errorType } from './util/status.js';
import { errorHandler } from './error/error.js'

import channelRoutes from './routes/channel.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import workspaceRoutes from './routes/workspace.js';
import staticDataRoutes from './routes/static-data.js';

dotenv.config();

const app = express();
const DATABASE_URL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.vkqqcqz.mongodb.net/${process.env.DATABASE_DEFAULT_NAME}?retryWrites=true&w=majority`;

// 정적 file처리를 위한 변수
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 파일 저장할 위치와 저장 형태 정의
// 해결: uuid패키지 사용
const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'file');
    },
    filename: (req, file, callback) => {
        callback(null, v4());
    }
});

// 파일 확장자 검사
const fileFilter = (req, file, callback) => {
    const fileType = ['image/jpeg', 'image/png', 'image/jpg'];
    const mimeType = fileType.find(fileType => fileType === file.mimetype);
    console.log('app.js req.body: ', req.body)
    console.log('file : ', file);
    console.log('mimeType : ', mimeType);
    if (mimeType) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

// 요청 응답 로그 출력
if (process.env.NODE_ENV === 'production') {
    console.log('배포 환경!!');
    app.use(morgan('combined'));
} else {
    console.log('개발 환경!!');
    app.use(morgan('dev'));
}

// 파싱 미들웨어
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/file', express.static(path.join(__dirname, 'file')));// 이미지 폴더를 정적으로 사용
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('file'));

//cors에러 해결을 위한 헤더설정
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization', 'RefreshToken');
    next();
})


// 라우트 접근
app.use('/v1/channel', channelRoutes);
app.use('/v1/static-data', staticDataRoutes);
app.use('/v1/user', userRoutes);
app.use('/v1/chat', chatRoutes);
app.use('/v1/workspace', workspaceRoutes);

// 오류 처리
app.use((error, req, res, next) => {
    console.log('미들웨어 함수 진입.... throw 된 에러: ', error);
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
            // return '백엔드 서버 socket 가동!!!';
        });

    }).catch(err => {
        console.log('몽구스 오류!!! : ', err);
    });

redisClient.connect();