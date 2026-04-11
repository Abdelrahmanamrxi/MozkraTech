import { Router } from "express";
import {  updateProfile, shareProfile, dashboard, addFriend, getProfile, acceptFriendRequest, declineFriendRequest, deleteFriend } from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { updateProfileSchema, shareProfileSchema } from "./user.validation.js";
import { authentication, authorization } from '../../middleware/auth.js';
import { roleTypes } from "../../DB/models/user.model.js";

const userRouter = Router();


userRouter.patch('/update-profile', authentication, validation(updateProfileSchema), updateProfile);
userRouter.patch('/share-profile/:id', authentication, validation(shareProfileSchema), shareProfile);
userRouter.post("/dashboard", authentication,authorization([roleTypes.admin]), dashboard)
userRouter.patch("/add-friend/:userId", authentication, addFriend);
userRouter.patch("/accept-friend/:id", authentication, acceptFriendRequest);
userRouter.patch("/decline-friend/:id", authentication, declineFriendRequest);
userRouter.patch("/delete-friend/:id", authentication, deleteFriend);
userRouter.post("/get-profile", authentication, getProfile);



export default userRouter;