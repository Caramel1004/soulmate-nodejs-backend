import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v4 } from 'uuid';

import SocketIO from './socket.js';
import { errorType } from './util/status.js';

import channelRoutes from './routes/channel.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';

const app = express();

// 정적 file처리를 위한 변수
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 해결: uuid패키지 사용
const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'chat');
    },
    filename: (req, file, callback) => {
        callback(null, v4());
    }
});

// 파일 확장자 검사
const fileFilter = (req, file, callback) => {
    const fileType = ['image/jpeg', 'image/png', 'image/jpg'];
    const mimeType = fileType.find(fileType => fileType === file.mimetype);
    console.log('file : ', file);
    console.log('mimeType : ', mimeType);
    if (mimeType) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

// 파싱 미들웨어
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('file'));
app.use('/images', express.static(path.join(__dirname, 'images')));// 이미지 폴더를 정적으로 사용

//cors에러 해결을 위한 헤더설정
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
    next();
})

// 라우트 접근
app.use('/v1/channel', channelRoutes);
app.use('/v1/user', userRoutes);
app.use('/v1/chat', chatRoutes);

// 오류 처리
app.use((error, req, res, next) => {
    if (!error.errReport) {
        error.errReport = errorType.E05.e500;
    }
    console.log(error);
    res.status(error.errReport.code).json({
        error: error
    });
    // next();
});

//몽구스와 연결후 서버 실행
mongoose.connect('mongodb+srv://caramel1004:sK0eztAhijnYoDlT@cluster0.vkqqcqz.mongodb.net/soulmate?retryWrites=true&w=majority')
    .then(result => {
        // 서버사이드 웹 소켓
        const server = app.listen(8080, () => console.log(`Node Server 8080 start!!`));
        const io = SocketIO.init(server);

        io.emit('connection', socket => {
            console.log('서버 socket 가동!!!: ');
            return socket;
        });
    }).catch(err => {
        console.log('몽구스 오류!!! : ', err);
    });