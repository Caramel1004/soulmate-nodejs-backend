import mongoose from "mongoose";

const { Schema } = mongoose;

//채팅방 스키마
const chatRoomSchema = new Schema({
    channelId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    roomName: {
        type: String,
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    imageUrl: [{
        type: String
    }],
    chatList: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    }],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

// 채팅 스키마
const chatSchema = new Schema({
    chat: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date
    }
}, { timestamps: true });

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
const Chat = mongoose.model('Chat', chatSchema);

export { ChatRoom };
export { Chat };

// export default { ChatRoom,Chat}