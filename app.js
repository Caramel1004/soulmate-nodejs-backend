import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';


import channelRoutes from './routes/channel.js';
import userRoutes from './routes/user.js';

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    //cors에러 해결을 위한 헤더설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

// 라우트 접근
app.use('/v1/channel',channelRoutes);
app.use('/v1/user',userRoutes);

app.use((error, req, res, next) => {
    console.log('app.js: ', error);
    const statusCode = (!error.statusCode) ? 500 : error.statusCode;
    const msg = error.message;
    const data = error.data;
    
    res.status(statusCode).json({
        message: msg,
        statusCode: statusCode,
        data: data
    });
    next();
})
//몽구스와 연결후 서버 실행
mongoose.connect('mongodb+srv://caramel1004:sK0eztAhijnYoDlT@cluster0.vkqqcqz.mongodb.net/soulmate?retryWrites=true&w=majority')
    .then(result => {
        app.listen(8080,() => console.log('Node 8080 Server start!!!'));
        // const server = app.listen(8080, () => console.log(`Node Server 8080 start!!`));
        // const io = SocketIO.init(server);
        // io.on('connection', socket => {
        //     console.log('socket 가동!!!');
        // });
    }).catch(err => {
        console.log('app.js err:', err);
    });