import connectToDB from "./DB/connectionDB.js";
import userRouter from "./modules/user/user.routes.js";
import { globalErrorHandling } from "./utils/globalErrorHandling/index.js";
import notFound from "./middleware/notFound.js";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import limiter from "./middleware/rateLimiter.js";

const bootstrap = (app, express) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(morgan("dev"));
    app.use("/users", userRouter);

    app.use(
        cors({
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        }),
    );

    app.use(limiter);

  // {/** Testing api */}
  // app.get('/api/v1',async(req,res,next)=>{
  //     res.status(200).json({message:'OK',status:200})
    // })
    


    app.use(errorHandler);
    // app.use(globalErrorHandling);



    app.use(notFound);
};

export default bootstrap;
