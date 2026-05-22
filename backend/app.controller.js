import connectToDB from "./DB/connectionDB.js";
import userRouter from "./modules/user/user.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import subjectRouter from "./modules/subject/subject.routes.js";
import notificationRouter from "./modules/notifications/notifications.routes.js";
import friendsRouter from "./modules/friendship/friends.routes.js";
import notFound from "./middleware/notFound.js";
import cors from "cors";
import { deleteDueTasks } from "./cron/task.cron.js";
import { updateMissedSessions } from "./cron/session.cron.js";
import { remindUserSession,remindUserTask } from "./cron/reminder.cron.js";
import { weeklyResetCompletedGoals } from "./cron/weeklyReset.cron.js";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import limiter from "./middleware/rateLimiter.js";
import chatRouter from "./modules/chat/chat.route.js";
import sessionRouter from "./modules/sessions/session.route.js";
import taskRouter from "./modules/task/task.routes.js";
import achievementRouter from "./modules/achievement/achievement.route.js";
import path from "path";

const bootstrap = async (app, express) => {
  // 1. Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // 2. Connect to DB
  await connectToDB();

  // 2. CORS (must be early)
  app.use(
    cors({
      origin: [process.env.FRONTEND_URL, "http://localhost:5174"],
      //origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    }),
  );

  // 3. Logging
  app.use(morgan("dev"));

  // 4. Rate limiting
  app.use(limiter);

  // 4.1 Static uploads
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // 5. Routes

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/subjects", subjectRouter);
  app.use("/api/v1/chat", chatRouter);
  app.use("/api/v1/friends", friendsRouter);
  app.use("/api/v1/notifications", notificationRouter);
  app.use("/api/v1/sessions", sessionRouter);
  app.use("/api/v1/tasks", taskRouter);
  app.use('/api/v1/achievements',achievementRouter)

  // 5- CRON Tasks
  updateMissedSessions()
  deleteDueTasks()
  remindUserSession()
  remindUserTask()
  weeklyResetCompletedGoals()



  // 6. Error handling (last)
  app.use(errorHandler);
  app.use(notFound);
};

export default bootstrap;
