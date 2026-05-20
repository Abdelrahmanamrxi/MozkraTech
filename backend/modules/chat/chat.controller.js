import conversationModel from "../../DB/models/Conversation.model.js";
import messageModel from "../../DB/models/message.model.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const getChat = asyncHandler(async (req, res) => {
  const { conversationId, cursor } = req.query; // Use Cursor To Load 20 Messages Before That
  const query = { conversationId };
  const userId = req.user?._id;

  if (!conversationId) {
    return res.status(200).json({ message: "No chat found", chat: null });
  }

  if (cursor) {
    const parsedCursor = new Date(cursor);
    if (!Number.isNaN(parsedCursor.getTime())) {
      query.createdAt = { $lt: parsedCursor };
    }
  }

  if (userId) {
    query.deletedFor = { $ne: userId };
  }

  const messages = await messageModel
    .find(query)
    .populate(
      "senderId",
      "fullName email profileImage image lastActivityDate",
    )
    .sort({ createdAt: -1 })
    .limit(20);
  let unreadCount;
  const formattedChat = {
    messages: messages.map((msg) => ({
      _id: msg._id,
      message: msg.isDeletedForAll ? "" : msg.content,
      senderId: msg.senderId,
      senderProfileImage: msg.senderId?.profileImage ?? null,
      createdAt: msg.createdAt,
      isRead: msg.isRead,
      isDeletedForAll: msg.isDeletedForAll,
      deletedAt: msg.deletedAt,
      deletedBy: msg.deletedBy,
    })),
  };
  console.log(formattedChat);
  return res
    .status(200)
    .json({ message: "Chat retrieved successfully", chat: formattedChat });
});
