import { authSocket } from "../../middleware/auth.js";
import conversationModel from "../../DB/models/Conversation.model.js";
import messageModel from "../../DB/models/message.model.js";
import { connectioUser } from "./chat.socket.service.js";

export const sendMessage = async (socket) => {
  socket.on("sendMessage", async (messageInfo) => {
    const { message, destId } = messageInfo;
    
    const data = await authSocket({ socket });
    if (data.statusCode != 200) {
      return socket.emit("authError", data);
    }
    const userId = data.user._id;


let conversation = await conversationModel.findOneAndUpdate(
  {
    $or: [
      { userId: userId, otherUserId: destId },
      { userId: destId, otherUserId: userId },
    ],
  },
  { 
    $set: { lastMessageAt: Date.now() }, 
    $setOnInsert: { 
        userId: userId,
        otherUserId: destId,
        participantType: 'user-to-user' 
    }
  },
  { upsert: true, new: true, runValidators: true } 
).populate("userId otherUserId");

    
    const newMessage = await messageModel.create({
        conversationId: conversation._id,
        senderId: userId,
        content: message,
        isRead:true
    });

    
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    
    const chatForFrontend = {
        mainUser: conversation.userId || { _id: userId },
        subParticipant: conversation.otherUserId || { _id: destId }
    };
      
    socket.emit("successMessage", { message: newMessage.content, chat: chatForFrontend });
    
    const receiverSocketId = connectioUser.get(destId.toString());
    if (receiverSocketId) {
        socket.to(receiverSocketId).emit("receiveMessage", { message: newMessage.content, chat: chatForFrontend });
    }
  });
};