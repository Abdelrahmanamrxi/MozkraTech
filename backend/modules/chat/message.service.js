import { authSocket } from "../../middleware/auth.js";
import conversationModel from "../../DB/models/Conversation.model.js";
import userModel from "../../DB/models/user.model.js";
import messageModel from "../../DB/models/message.model.js";
import { connectioUser } from "./chat.socket.service.js";
import { setUserOnline } from "./chat.socket.service.js";
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
    setUserOnline(userId.toString());

    const participantsIds = [userId.toString(), destId.toString()];

    let conversation = await conversationModel.findOne({
      "participants.user": { $all: participantsIds },
      participantType: "user-to-user",
    });

    if (conversation) {
      const receiver = conversation.participants.find(
        (participant) => participant.user.toString() === destId.toString(),
      );

      if (receiver) {
        receiver.unReadCount = (receiver.unReadCount || 0) + 1;
      }

      conversation.lastMessageAt = Date.now();
      await conversation.save();
    } else {
      conversation = await conversationModel.create({
        participants: [
          { user: userId, unReadCount: 0 },
          { user: destId, unReadCount: 1 },
        ],
        participantType: "user-to-user",
        lastMessageAt: Date.now(),
      });
    }

    const newMessage = await messageModel.create({
      conversationId: conversation._id,
      senderId: userId,
      content: message,
      isRead: false,
    });


    conversation.lastMessage = newMessage._id;
    await conversation.save();
    const receiverStatus = userStatus.get(destId.toString())
    console.log(userStatus.get(destId.toString(),receiverStatus))
    socket.emit("successMessage", {
      conversationId: conversation._id,
      message: newMessage.content,
      sentAt: newMessage.createdAt,
      senderId: userId.toString(),
      receiverId: destId.toString(),
      status: receiverStatus || { status: "offline", lastActivityDate: null },
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
    setUserOnline(userId);
    
    const conversation = await conversationModel
      .findOneAndUpdate(
        { _id: conversationId, "participants.user": userId },
        { $set: { "participants.$.unReadCount": 0 } },
        { new: true }
      )
      .select("participants");

    if (!conversation) {
      return socket.emit("sendError", {
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.user.toString() === userId,
    );

    const currentUserStatus = userStatus.get(userId);
  
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

    // Mark all unread messages from the other participant as read
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

    const currentStatusPayload =
      currentUserStatus ||
      ({
        status: "online",
        lastActivityDate: Date.now(),
      });

    let otherParticipantStatus = userStatus.get(
      otherParticipant.user.toString(),
    );

    if (!otherParticipantStatus) {
      const friend = await userModel.findById(otherParticipant.user).select(
        "lastActivityDate",
      );
      otherParticipantStatus = {
        status: "offline",
        lastActivityDate: friend?.lastActivityDate || null,
      };
    }

    // Emit confirmation back to the current user with the friend's status
    socket.emit("markAsReadConfirmed", {
      conversationId,
      unReadCount: 0,
      status: otherParticipantStatus,
    });

    // Notify the sender that their messages have been read, include reader status
    const otherParticipantSocketId = connectioUser.get(
      otherParticipant.user.toString(),
    );

    if (otherParticipantSocketId) {
      socket.to(otherParticipantSocketId).emit("messagesMarkedAsRead", {
        conversationId,
        status: currentStatusPayload,
      });
    }
  });
};