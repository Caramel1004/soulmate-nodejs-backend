import { Server } from 'socket.io';
let socketIO;

export default {
    init: server => {
        socketIO = new Server(server, {
            cors: {
                origin: ['https://somat.site', 'https://www.somat.site', 'http://localhost:4000'],
                methods: ['GET, POST, PUT, PATCH, DELETE'],
                allowedHeaders: ['Content-Type', 'application/json'],
                credentials: true
            }
        });
        return socketIO;
    },
    getSocketIO: () => {
        if (!socketIO) {
            const error = new Error('소켓이 선언되지 않았습니다.');
            error.stausCode = 400;
        }
        return socketIO;
    }
};