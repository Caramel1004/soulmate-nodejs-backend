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
    photo: {
        type: String,
        default: 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg'
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