import { Router } from "express";
import { confirmEmail, forgetPassword, login, loginWithGoogle, refreshToken, resetPassword, signUp } from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { confirmEmailSchema, forgetPasswordSchema, loginSchema, loginWithGoogleSchema, refreshTokenSchema, resetPasswordSchema, signUpSchema } from "./user.validation.js";

const userRouter = Router();


userRouter.post("/signUp", validation(signUpSchema),signUp);
userRouter.patch("/confirmEmail", validation(confirmEmailSchema), confirmEmail);
userRouter.post("/login", validation(loginSchema),login);
userRouter.get("/refreshToken", validation(refreshTokenSchema), refreshToken);
userRouter.patch("/forgetPassword", validation(forgetPasswordSchema), forgetPassword);
userRouter.patch("/resetPassword", validation(resetPasswordSchema), resetPassword);
userRouter.post("/loginWithGoogle",validation(loginWithGoogleSchema),loginWithGoogle);



export default userRouter;