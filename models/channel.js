import mongoose from "mongoose";

const { Schema } = mongoose;

const channelSchema = new Schema({
    channelName: {
        type: String,
        required: true
    },
    owner: {
        ownerId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        ownerName: {
            type: String,
            required: true
        }
    },
    headcount: {
        type: 'Number',
        default: 1
    },
    thumbnail: {
        type: String,
        default: 'images/apple-touch-icon.png'
    },
    category: [{
        type: String,
        required: true
    }],
    content: {
        type: String
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    chatRooms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ChatRoom'
        }
    ],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('Channel', channelSchema);