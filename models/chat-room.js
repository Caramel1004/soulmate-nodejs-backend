import mongoose from "mongoose";

const { Schema } = mongoose;

//채팅방 스키마
const chatRoomSchema = new Schema({
    channelId: {
        type: Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    roomName: {
        type: String,
        required: true
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    chats: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Chat',
            required: true
        }
    ],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

// 채팅 스키마
const chatSchema = new Schema({
    chat: {
        type: String
    },
    fileUrls: [{
        type: String
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isNotice: {
        type: String,
        default: 'N'
    }
}, { timestamps: true });

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
const Chat = mongoose.model('Chat', chatSchema);

export { ChatRoom };
export { Chat };