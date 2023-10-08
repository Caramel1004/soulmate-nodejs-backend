import mongoose from "mongoose";

const { Schema } = mongoose;

const feedSchema = new Schema({
    channelId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    imageUrls: [{
        type: String
    }],
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    feedReplys: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

const feedReplySchema = new Schema({
    feedId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export const Feed = mongoose.model('Feed', feedSchema);
export const FeedReply = mongoose.model('FeedReply', feedReplySchema);