import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema({
    participantType: {
        type: String,
        enum: ['user-to-ai', 'user-to-user'],
        default: 'user-to-ai'
    },
    participants: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            unReadCount: { type: Number, default: 0 }
        }
    ],
    pdfLimit: {
        type: Number,
        default: 0
    },
    subject: {
        type: String,
        default: null
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    lastMessageAt: {
        type: Date,
        default: null
    },

}, {
    timestamps: true,
});
conversationSchema.index({ "participants.user": 1 });
const conversationModel =
    mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);

export default conversationModel;