import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participantType: {
        type: String,
        enum: ['user-to-ai', 'user-to-user'],
        default: 'user-to-ai'
    },
    participants: [
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        unreadCount: { type: Number, default: 0 }
        }]
    ,
    otherUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
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
    unreadCount: [{
        type: Number,
        default: 0
    }],
}, {
    timestamps: true,
});

const conversationModel =
    mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);

export default conversationModel;