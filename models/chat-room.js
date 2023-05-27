import mongoose from "mongoose";

const { Schema } = mongoose;

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
    chat: [{
        type: String
    }],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('ChatRoom', chatRoomSchema);