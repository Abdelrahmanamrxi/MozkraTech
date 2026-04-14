import { authSocket } from "../../middleware/auth.js";
import chatModel from "../../DB/models/chat.model.js";
import { connectioUser } from "./chat.socket.service.js";

export const sendMessage = async (socket) => {
  socket.on("sendMessage", async (messageInfo) => {
    const { message, destId } = messageInfo;
    console.log(messageInfo);
    const data = await authSocket({ socket });
    if (data.statusCode != 200) {
      return socket.emit("authError", data);
    }
    const userId = data.user._id;
    let chat =  await chatModel.findOneAndUpdate(
      {
        $or: [
          { mainUser: userId, subParticipant: destId },
          { mainUser: destId, subParticipant: userId },
        ],
      },
      {
        $push: {
          messages: { senderId: userId, message },
        },
      },
      { new: true },
    )
        if (!chat) {
            chat = await chatModel.create({
               mainUser: userId,
               subParticipant: destId,
               messages: [{ senderId: userId, message }],
           }) ;
      }
      
      socket.emit("successMessage", { message });
      socket.to(connectioUser.get(destId.toString())).emit("receiveMessage", { message, chat });
    });
};
