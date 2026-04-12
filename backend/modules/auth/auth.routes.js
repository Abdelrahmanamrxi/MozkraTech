import { Router } from "express";
import { signUpSchema,confirmEmailSchema,loginSchema,
    forgetPasswordSchema,resetPasswordSchema,
    signUpWithGoogleSchema,loginWithGoogleSchema,resendOTPSchema
 } from "./auth.validation.js";
import { validation } from "../../middleware/validation.js";
 import { signUp,confirmEmail,login,refreshToken,forgetPassword,
    resetPassword,signUpWithGoogle,loginWithGoogle,resendOTP
  } from "./auth.controller.js";
const authRouter = Router();

authRouter.post("/register", validation(signUpSchema),signUp);
authRouter.patch("/confirm-email", validation(confirmEmailSchema), confirmEmail);
authRouter.post("/login", validation(loginSchema),login);
authRouter.post("/refresh-token", refreshToken);
authRouter.patch("/forget-password", validation(forgetPasswordSchema), forgetPassword);
authRouter.patch("/reset-password", validation(resetPasswordSchema), resetPassword);
authRouter.post("/signup-with-google",validation(signUpWithGoogleSchema),signUpWithGoogle);
authRouter.post("/login-with-google",validation(loginWithGoogleSchema),loginWithGoogle);
authRouter.post('/resend-otp', validation(resendOTPSchema), resendOTP);


export default authRouter