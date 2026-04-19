import mongoose from "mongoose";


const messageSchema =  new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    senderType: {
      type: String,
      enum: ["user", "ai-assistant"],
      default: "user",
    },
    content: {
      type: String,
      required: true
    },
    isRead:{
      type:Boolean,
      default:false,
      required:true
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "code", "suggestion"],
      default: "text",
    },
    attachments: [
      {
        url: { type: String },
        filename: { type: String },
        mimeType: { type: String },
        size: { type: Number },
        metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
      },
    ],
    aiContext: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    reactions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        emoji: { type: String },
        createdAt: {
          type: Date,
          default: Date.now
        },
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const messageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default messageModel;
