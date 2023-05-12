import mongoose from "mongoose";

const { Schema } = mongoose;

const chatRoomSchema = new Schema({
    channelId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    users: {
        type: [userSchema],
        required: true
    },
    imageUrl: {
        type: String
    },
    chat: {
        type: String
    },
    createdAt: {
        type: Date
    }
},{timestamps: true});

export default mongoose.model('ChatRoom',chatRoomSchema);