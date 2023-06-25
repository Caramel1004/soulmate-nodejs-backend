import mongoose from "mongoose";

const { Schema } = mongoose;

// 워크스페이스 스키마
const workSpaceSchema = new Schema({
    workSpaceName: {
        type: String,
        required: true
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'post'
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
        type: Date,
        required: true
    }
}, { timestamps: true });

import mongoose from "mongoose";


//게시물 스키마
const postSchema = new Schema({
    content: {
        type: Schema.Types.ObjectId
    },
    fileUrl: {
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true
    },
    reply: [{
        type: Schema.Types.ObjectId
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

const workSpace = mongoose.model('WorkSpace', workSpaceSchema);
const Post = mongoose.model('Post', postSchema);
const Reply = mongoose.model('Reply', replySchema);
const Scrap = mongoose.model('Scrap', scrapSchema);

export default { workSpace, Post, Reply, Scrap };
// export { Post };
// export { Reply };
// export { Scrap };