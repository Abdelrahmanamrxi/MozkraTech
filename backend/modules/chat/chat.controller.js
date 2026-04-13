import chatModel from "../../DB/models/chat.model.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const getChat = asyncHandler(async (req, res) => { 
    const { userId } = req.params;
    const chat = await chatModel.findOne({ 
        $or: [
            {mainUser: req.user._id,subParticipant: userId},
            {mainUser: userId,subParticipant: req.user._id}
        ]
    }).populate([
        { path: "mainUser", select: "name email profilePicture image" },
        {path:"messages.senderId", select: "name email profilePicture image"}
    ])
    if (!chat) {
        return res.status(200).json({ message: "No chat found", chat: null });
    }
    return res.status(200).json({ message: "Chat retrieved successfully", chat });
})