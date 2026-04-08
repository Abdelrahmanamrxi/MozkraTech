import connectToDB from "./DB/connectionDB.js";
import userRouter from "./modules/user/user.routes.js";
import notFound from "./middleware/notFound.js";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import limiter from "./middleware/rateLimiter.js";


const bootstrap = (app, express) => {
    // 1. Body parsers
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    // 2. CORS (must be early)
    app.use(
        cors({
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            credentials: true,
        }),
    );

    // 3. Logging
    app.use(morgan("dev"));

    // 4. Rate limiting
    app.use(limiter);

    // 5. Routes
    app.use("/api/v1/auth", userRouter);

    // 6. Error handling (last)
    app.use(errorHandler);
    app.use(notFound);
};

export default bootstrap;
