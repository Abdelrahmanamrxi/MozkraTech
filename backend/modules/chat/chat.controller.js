import conversationModel from "../../DB/models/Conversation.model.js";
import messageModel from "../../DB/models/message.model.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const getChat = asyncHandler(async (req, res) => { 
    const { userId } = req.params;
    
    
    const conversation = await conversationModel.findOne({ 
        $or: [
            {userId: req.user._id, otherUserId: userId},
            {userId: userId, otherUserId: req.user._id}
        ]
    }).populate([
        { path: "userId", select: "fullName email profilePicture image" },
        { path: "otherUserId", select: "fullName email profilePicture image" }
    ]);

    if (!conversation) {
        return res.status(200).json({ message: "No chat found", chat: null });
    }

    
    const messages = await messageModel.find({ conversationId: conversation._id })
        .populate("senderId", "fullName email profilePicture image");


    const formattedChat = {
        mainUser: conversation.userId,
        subParticipant: conversation.otherUserId,
        messages: messages.map(msg => ({
            _id: msg._id,
            message: msg.content, 
            senderId: msg.senderId
        }))
    };

    return res.status(200).json({ message: "Chat retrieved successfully", chat: formattedChat });
});