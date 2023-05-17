import ChatRoom from '../models/chat-room.js'

const chatController = {
    //채팅룸 로딩
    getLoadChatRoom: async (req, res, next) => {
        try {
            const chatRoomId = req.params.chatRoomId;
            const chatRoom = await ChatRoom.findById(chatRoomId);

            res.status(200).json({
                msg: '채팅방이 로딩 되었습니다.',
                chatRoom: chatRoom
            })
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
}

export default chatController;