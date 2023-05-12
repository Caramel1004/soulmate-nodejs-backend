import mongoose from "mongoose";

const { Schema } = mongoose;

const channelSchema = new Schema({
    channelName: {
        type: String,
        required: true
    },
    owner: {
        ownerId:{
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
        default: '1'
    },
    thumbnail:{
        type: String,
        default: 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg'
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    chatRooms: [{
        type: Schema.Types.ObjectId,
        ref: 'chatRoom'
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('Channel', channelSchema);