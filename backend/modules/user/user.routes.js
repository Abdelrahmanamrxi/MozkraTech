import { Router } from "express";
import { confirmEmail, resendOTP,forgetPassword, login, loginWithGoogle, refreshToken, resetPassword, signUp, signUpWithGoogle, updateProfile, shareProfile, dashboard, addFriend, getProfile, acceptFriendRequest, declineFriendRequest, deleteFriend } from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { confirmEmailSchema, resendOTPSchema ,forgetPasswordSchema, loginSchema, loginWithGoogleSchema, refreshTokenSchema, resetPasswordSchema, signUpSchema, signUpWithGoogleSchema, updateProfileSchema, shareProfileSchema } from "./user.validation.js";
import { authentication, authorization } from '../../middleware/auth.js';
import { roleTypes } from "../../DB/models/user.model.js";

const userRouter = Router();


userRouter.post("/register", validation(signUpSchema),signUp);
userRouter.patch("/confirm-email", validation(confirmEmailSchema), confirmEmail);
userRouter.post("/login", validation(loginSchema),login);
userRouter.post("/refresh-token", validation(refreshTokenSchema), refreshToken);
userRouter.patch("/forget-password", validation(forgetPasswordSchema), forgetPassword);
userRouter.patch("/reset-password", validation(resetPasswordSchema), resetPassword);
userRouter.post("/signup-with-google",validation(signUpWithGoogleSchema),signUpWithGoogle);
userRouter.post("/login-with-google",validation(loginWithGoogleSchema),loginWithGoogle);
userRouter.post('/resend-otp', validation(resendOTPSchema), resendOTP);
userRouter.patch('/update-profile', authentication, validation(updateProfileSchema), updateProfile);
userRouter.patch('/share-profile/:id', authentication, validation(shareProfileSchema), shareProfile);
userRouter.post("/dashboard", authentication,authorization([roleTypes.admin]), dashboard)
userRouter.patch("/add-friend/:userId", authentication, addFriend);
userRouter.patch("/accept-friend/:id", authentication, acceptFriendRequest);
userRouter.patch("/decline-friend/:id", authentication, declineFriendRequest);
userRouter.patch("/delete-friend/:id", authentication, deleteFriend);
userRouter.post("/get-profile", authentication, getProfile);



export default userRouter;