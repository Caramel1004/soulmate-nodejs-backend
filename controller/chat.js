import ChatRoom from '../models/chat-room.js'
import Channel from '../models/channel.js';
import User from '../models/user.js';
import SocketIO from '../socket.js';

const chatController = {
    //채팅룸 로딩
    getLoadChatRoom: async (req, res, next) => {
        try {
            const clientChannelId = req.params.channelId;
            const chatRoomId = req.params.chatRoomId;
            const userId = '645bc55b7d8b60a0021cb1b5';

            const matchedUser = await User.findById(userId).populate('chatRooms');
            const chatRoomList = matchedUser.chatRooms;
            const chatRoom = await ChatRoom.findById(chatRoomId);

            // console.log(`clientChannelId: ${clientChannelId}, chatRoomId: ${chatRoomId}`);
            // console.log('chatRoomList: ', chatRoomList);
            // console.log('chatRoom: ', chatRoom);
            if (chatRoom.channelId.toString() !== clientChannelId.toString()) {
                const error = new Error('데이터베이스 채널아이디랑 일치하지 않습니다!');
                error.statusCode = 403;
                throw error;
            } else {
                // const serverIO = SocketIO.getSocketIO();
                // serverIO.emit('loadChat', {
                //     msg: '소켓 채팅방 로딩',
                //     chatRooms: chatRoomList,
                //     chatRoom: chatRoom
                // });

                res.status(200).json({
                    msg: '채팅방이 로딩 되었습니다.',
                    chatRooms: chatRoomList,
                    chatRoom: chatRoom
                });
            }
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    // 실시간 채팅
    patchSendChat: async (req, res, next) => {
        try {
            const clientChannelId = req.params.channelId;
            const chatRoomId = req.body.chatRoomId;
            const reqChat = req.body.chat;
            console.log('reqChat: ', reqChat);
            const chatRoom = await ChatRoom.findById(chatRoomId);

            chatRoom.chat.push(reqChat);

            await chatRoom.save();
            console.log('chatRoom: ', chatRoom);

            const serverIO = SocketIO.getSocketIO();

            serverIO.emit('sendChat', {
                msg: '소켓 메세지 전송',
                chatRoom: chatRoom,
                currentChat: reqChat
            });

            res.status(200).json({
                msg: '채팅 중',
                chatRoom: chatRoom
            });

            // next();
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }

    }
}

export default chatController;