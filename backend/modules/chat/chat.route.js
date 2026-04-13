import { Router } from "express";
import { authentication } from "../../middleware/auth.js";
import { getChat } from "./chat.controller.js";

const chatRouter = Router();

chatRouter.get("/:userId", authentication, getChat)



export default chatRouter;