import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema({
    channelId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    content: [{
        type: String,
        required: true
    }],
    creator: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);