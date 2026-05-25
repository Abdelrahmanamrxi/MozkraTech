import { Router } from "express";
import { authentication } from "../../middleware/auth.js";
import { sendMessageToAi,getChat,getAIChat, getAllAIConversations,deleteAiConversation } from "./chat.controller.js";
import multer from "multer";
import { chatUpload } from "../../middleware/upload.js";
const chatRouter = Router();

chatRouter.get("/", authentication, getChat)
chatRouter.post('/ai',authentication,chatUpload.single("file"),sendMessageToAi)
chatRouter.get('/ai/:conversationId',authentication,getAIChat)
chatRouter.delete("/ai/:conversationId",authentication,deleteAiConversation)
chatRouter.get('/ai',authentication,getAllAIConversations)



export default chatRouter;