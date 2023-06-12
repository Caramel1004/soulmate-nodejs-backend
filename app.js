import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import SocketIO from './socket.js';

import { errorType } from './util/status.js';

import channelRoutes from './routes/channel.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';

const app = express();

app.use(bodyParser.json());

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