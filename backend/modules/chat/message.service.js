import { authSocket } from "../../middleware/auth.js";
import conversationModel from "../../DB/models/Conversation.model.js";
import messageModel from "../../DB/models/message.model.js";
import { connectioUser } from "./chat.socket.service.js";
import { userStatus } from "./chat.socket.service.js";
import { notificationModel } from "../../DB/models/notifications.model.js";
export const sendMessage = async (socket) => {
  socket.on("sendMessage", async ({ message, destId }) => {
    if (!destId || !message || !message.trim()) {
      return socket.emit("sendError", {
        message: "destId and message are required",
      });
    }

    const data = await authSocket({ socket });
    if (data.statusCode !== 200) {
      return socket.emit("authError", data);
    }

    const userId = data.user._id;

    const participantsIds = [userId.toString(), destId.toString()].sort();

    const conversation = await conversationModel.findOneAndUpdate(
      {
        "participants.user": { $all: participantsIds },
      },
      {
        $set: { lastMessageAt: Date.now() },
        $setOnInsert: {
          participants: [
            { user: participantsIds[0] },
            { user: participantsIds[1] },
          ],
          participantType: "user-to-user",
        },
      },
      { upsert: true, new: true }
    );

    const newMessage = await messageModel.create({
      conversationId: conversation._id,
      senderId: userId,
      content: message,
      isRead: false,
    });

  
    conversation.lastMessage = newMessage._id;
    await conversation.save();
    const status=userStatus.get(userId)

    socket.emit("successMessage", {
      conversationId: conversation._id,
      message: newMessage.content,
      sentAt: newMessage.createdAt,
      senderId: userId.toString(),
      receiverId: destId.toString(),
      status:status
    });

   
    const receiverSocketId = connectioUser.get(destId.toString());

    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("receiveMessage", {
        conversationId: conversation._id,
        message: newMessage.content,
        sentAt: newMessage.createdAt,
        senderId: userId.toString(),
        receiverId: destId.toString(),
      });
    }
  });
};

export const markAsRead = async (socket) => {
  socket.on("markAsRead", async ({ conversationId }) => {
    if (!conversationId) {
      return socket.emit("sendError", {
        message: "conversationId is required",
      });
    }

    const data = await authSocket({ socket });
    if (data.statusCode !== 200) return socket.emit("authError", data);

    const userId = data.user._id.toString();
    const conversation = await conversationModel
      .findOne({ _id: conversationId })
      .select("participants");

    if (!conversation) {
      return socket.emit("sendError", {
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.user.toString() === userId,
    );

    const status=userStatus.get(userId)

    if (!isParticipant) {
      return socket.emit("sendError", {
        message: "Not allowed to update this conversation",
      });
    }

    const otherParticipant = conversation.participants.find(
      (participant) => participant.user.toString() !== userId,
    );

    if (!otherParticipant) {
      return socket.emit("sendError", {
        message: "Conversation participant not found",
      });
    }

    await messageModel.updateMany(
      {
        conversationId,
        senderId: otherParticipant.user,
        isRead: false,
      },
      {
        $set: { isRead: true },
      },
    );

    const otherParticipantSocketId = connectioUser.get(
      otherParticipant.user.toString(),
    );

    if (otherParticipantSocketId) {
      socket.to(otherParticipantSocketId).emit("messagesMarkedAsRead", {
        conversationId,
        status
      });
    }
  });
};