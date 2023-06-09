import { Server } from 'socket.io';
let socketIO;

export default {
    init: server => {
        socketIO = new Server(server, {
            cors: {
                origin: '*',
                header: 'Content-Type'
            }
        });
        return socketIO;
    },
    getSocketIO: () => {
        if (!socketIO) {
            const error = new Error('소켓이 선언되지 않았습니다.');
            error.stausCode = 404;
        }
        return socketIO;
    }
};