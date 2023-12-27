import { Server } from 'socket.io';
let socketIO;

export default {
    init: server => {
        socketIO = new Server(server, {
            cors: {
                origin: 'http://3.39.235.59:3000',
                methods: ['GET, POST, PUT, PATCH, DELETE'],
                allowedHeaders: ['Content-Type', 'application/json']
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