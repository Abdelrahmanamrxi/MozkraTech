import { Router } from "express";
import {
  updateProfile,
  updateStudyPreferences,
  getProfileByID,
  dashboard,
  addFriend,
  getProfile,
  acceptFriendRequest,
  declineFriendRequest,
  deleteFriend,
  searchForUsers,
} from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import {
  updateProfileSchema,
  updateStudyPreferencesSchema,
  getProfileByIDSchema,
  searchForUsersSchema,
  addFriendSchema,
} from "./user.validation.js";
import { authentication, authorization } from "../../middleware/auth.js";
import { roleTypes } from "../../DB/models/user.model.js";

const userRouter = Router();

userRouter.get(
  "/",
  authentication,
  validation(searchForUsersSchema),
  searchForUsers,
);
userRouter.patch(
  "/update-profile",
  authentication,
  validation(updateProfileSchema),
  updateProfile,
);
userRouter.patch(
  "/study-preferences",
  authentication,
  validation(updateStudyPreferencesSchema),
  updateStudyPreferences,
);
userRouter.get(
  "/profile/:id",
  authentication,
  validation(getProfileByIDSchema),
  getProfileByID,
);
userRouter.post(
  "/dashboard",
  authentication,
  authorization([roleTypes.admin]),
  dashboard,
);
userRouter.patch(
  "/add-friend/:userId",
  authentication,
  validation(addFriendSchema),
  addFriend,
);
userRouter.patch(
  "/accept-friend/:userId",
  authentication,
  validation(addFriendSchema),
  acceptFriendRequest,
);
userRouter.patch(
  "/decline-friend/:userId",
  authentication,
  validation(addFriendSchema),
  declineFriendRequest,
);
userRouter.patch(
  "/delete-friend/:userId",
  authentication,
  validation(addFriendSchema),
  deleteFriend,
);
userRouter.post("/get-profile", authentication, getProfile);

export default userRouter;
