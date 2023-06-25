import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);