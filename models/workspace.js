import mongoose from "mongoose";

const { Schema } = mongoose;

// 워크스페이스 스키마
const workSpaceSchema = new Schema({
    channelId: {
        type: Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    workSpaceName: {
        type: String,
        required: true
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

//게시물 스키마
const postSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Reply'
    }],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

// 댓글 스키마
const replySchema = new Schema({
    content: {
        type: String
    },
    fileUrl: {
        type: String
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

// 스크랩 스키마
const scrapSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,

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

export const WorkSpace = mongoose.model('WorkSpace', workSpaceSchema);
export const Post = mongoose.model('Post', postSchema);
export const Reply = mongoose.model('Reply', replySchema);
export const Scrap = mongoose.model('Scrap', scrapSchema);