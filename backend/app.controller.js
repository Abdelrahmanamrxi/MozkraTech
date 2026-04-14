import connectToDB from "./DB/connectionDB.js";
import userRouter from "./modules/user/user.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import subjectRouter from "./modules/subject/subject.routes.js";
import friendsRouter from "./modules/friendship/friends.routes.js";
import notFound from "./middleware/notFound.js";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import limiter from "./middleware/rateLimiter.js";
import chatRouter from "./modules/chat/chat.route.js";

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
       origin: process.env.FRONTEND_URL,
    //origin: "*",
       methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
       credentials: true,
    }),
  );

  // 3. Logging
  app.use(morgan("dev"));

  // 4. Rate limiting
  app.use(limiter);

  // 5. Routes
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/subjects", subjectRouter);
  app.use("/api/v1/chat", chatRouter);
  app.use("/api/v1/friends", friendsRouter);

  // 6. Error handling (last)
  app.use(errorHandler);
  app.use(notFound);
};

export default bootstrap;
