import { Router } from "express";
import { authentication } from "../../middleware/auth.js";
import {
  getNotifications,
  getUnreadCount,
  markNotificationsRead,
} from "./notifications.controller.js";

const notificationRouter = Router();

notificationRouter.get(
  "/unread-count",
  authentication,
  getUnreadCount,
);
notificationRouter.patch(
  "/mark-read",
  authentication,
  markNotificationsRead,
);
notificationRouter.get("/", authentication, getNotifications);

export default notificationRouter;
