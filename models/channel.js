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
    comment: {
        type: String
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
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
    createdAt: {
        type: Date
    }
}, { timestamps: true });

channelSchema.post('save', () => {
    console.log('몽고디비 데이터베이스에 데이터 저장 성공');
})
export default mongoose.model('Channel', channelSchema);