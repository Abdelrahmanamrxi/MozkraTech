import { Router } from "express";
import { confirmEmail, resendOTP,forgetPassword, login, loginWithGoogle, refreshToken, resetPassword, signUp, signUpWithGoogle, updateProfile } from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { confirmEmailSchema, resendOTPSchema ,forgetPasswordSchema, loginSchema, loginWithGoogleSchema, refreshTokenSchema, resetPasswordSchema, signUpSchema, signUpWithGoogleSchema, updateProfileSchema } from "./user.validation.js";
import { authentication } from '../../middleware/auth.js';

const userRouter = Router();


userRouter.post("/register", validation(signUpSchema),signUp);
userRouter.patch("/confirm-email", validation(confirmEmailSchema), confirmEmail);
userRouter.post("/login", validation(loginSchema),login);
userRouter.post("/refresh-token", validation(refreshTokenSchema), refreshToken);
userRouter.patch("/forget-password", validation(forgetPasswordSchema), forgetPassword);
userRouter.patch("/reset-password", validation(resetPasswordSchema), resetPassword);
userRouter.post("/signup-with-google",validation(signUpWithGoogleSchema),signUpWithGoogle);
userRouter.post("/login-with-google",validation(loginWithGoogleSchema),loginWithGoogle);
userRouter.post('/resend-otp', validation(resendOTPSchema), resendOTP) 
userRouter.patch('/update-profile', authentication ,validation(updateProfileSchema), updateProfile) 



export default userRouter;