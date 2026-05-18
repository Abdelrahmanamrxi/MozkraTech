import { Router } from "express";
import {
  updateProfile,
  updateProfileImage,
  removeProfileImage,
  updateStudyPreferences,
  changePassword,
  deleteAccount,
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
import { profileImageUpload } from "../../middleware/upload.js";
import {
  updateProfileSchema,
  updateStudyPreferencesSchema,
  changePasswordSchema,
  deleteAccountSchema,
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
  "/profile-image",
  authentication,
  profileImageUpload.single("profileImage"),
  updateProfileImage,
);
userRouter.delete("/profile-image", authentication, removeProfileImage);
userRouter.patch(
  "/study-preferences",
  authentication,
  validation(updateStudyPreferencesSchema),
  updateStudyPreferences,
);
userRouter.patch(
  "/change-password",
  authentication,
  validation(changePasswordSchema),
  changePassword,
);
userRouter.patch(
  "/delete-account",
  authentication,
  validation(deleteAccountSchema),
  deleteAccount,
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
userRouter.get("/get-profile", authentication, getProfile);

export default userRouter;
