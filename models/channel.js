import mongoose from "mongoose";
import { ValidationError } from "../error/error.js";

const { Schema } = mongoose;

const channelSchema = new Schema({
    open: {
        type: String,
        required: true,
        default: 'N'
    },
    channelName: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    thumbnail: {
        type: String,
        default: 'images/soulmate.jpeg'
    },
    category: [
        {
            type: String,
            required: true
        }
    ],
    summary: {
        type: String
    },
    comment: {
        type: String
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    workSpaces: [
        {
            type: Schema.Types.ObjectId,
            ref: 'WorkSpace'
        }
    ],
    scraps: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Scrap'
        }
    ],
    chatRooms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ChatRoom'
        }
    ],
    feeds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Feed'
        }
    ],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

// Hook 함수 정의
channelSchema.post('post', async () => {
    console.log('몽고디비 데이터베이스에 데이터 저장 성공');
})

export default mongoose.model('Channel', channelSchema);