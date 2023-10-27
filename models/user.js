import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    photo: {
        type: String,
        default: 'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg'
    },
    phone: {
        type: String
    },
    snsConnectedAccount: {
        company: {
            type: String
        },
        account: {
            type: Schema.Types.ObjectId,
            ref: 'snsAccount'
        }
    },
    channels: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Channel'
        }
    ],
    wishChannels: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Channel'
        }
    ],
    createdAt: {
        type: Date
    }
}, { timestamps: true });

const snsAccountSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    body: {
        type: Object,
        required: true
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const SNS_Account = mongoose.model('snsAccount', snsAccountSchema);