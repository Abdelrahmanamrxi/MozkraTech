import { Router } from "express";
import { authentication } from "../../middleware/auth.js";
import { getNotifications } from "./notifications.controller.js";
const notificationRouter=Router()
notificationRouter.get('/',authentication,getNotifications)
export default notificationRouter