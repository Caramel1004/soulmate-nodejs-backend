import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    clientId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    channels: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Channel'
        }
    ],
    chatRooms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ChatRoom'
        }
    ],
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('User',userSchema);