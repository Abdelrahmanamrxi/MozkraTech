import { Router } from "express";
import {
  signUpSchema,
  confirmEmailSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  signUpWithGoogleSchema,
  loginWithGoogleSchema,
  resendOTPSchema,
} from "./auth.validation.js";
import { authentication } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import {
  signUp,
  confirmEmail,
  login,
  refreshToken,
  logout,
  resetPassword,
  signUpWithGoogle,
  loginWithGoogle,
  resendOTP,
  resetPasswordEmailCheck
} from "./auth.controller.js";
const authRouter = Router();

authRouter.post("/register", validation(signUpSchema), signUp);
authRouter.patch(
  "/confirm-email",
  validation(confirmEmailSchema),
  confirmEmail,
);
authRouter.post("/login", validation(loginSchema), login);
// refresh-token should use cookie-based refresh token only, not the access-token auth middleware
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", logout);
authRouter.post(
  "/forget-password",
  validation(forgetPasswordSchema),
  resetPasswordEmailCheck,
);
authRouter.patch(
  "/reset-password",
  validation(resetPasswordSchema),
  resetPassword,
);
authRouter.post(
  "/signup-with-google",
  validation(signUpWithGoogleSchema),
  signUpWithGoogle,
);
authRouter.post(
  "/login-with-google",
  validation(loginWithGoogleSchema),
  loginWithGoogle,
);
authRouter.post("/resend-otp", validation(resendOTPSchema), resendOTP);

export default authRouter;
