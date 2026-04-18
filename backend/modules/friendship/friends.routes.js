import { addFriend, searchFriends,acceptFriend, rejectFriend } from "./friends.controller.js";
import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { authentication } from "../../middleware/auth.js";
import { searchFriendSchema, shareProfileSchema,addFriendSchema,acceptFriendSchema,rejectFriendSchema } from "./friends.validation.js";
const friendsRouter = Router();
friendsRouter.get('/search',authentication,validation(searchFriendSchema),searchFriends)
friendsRouter.post('/request',authentication,validation(addFriendSchema),addFriend)
friendsRouter.patch('/accept',authentication,validation(acceptFriendSchema),acceptFriend)
friendsRouter.delete('/reject',authentication,validation(rejectFriendSchema),rejectFriend)
// friendsRouter.patch('/view-friend-profile/:id',authentication,validation(shareProfileSchema),viewProfileFriend)
// friendsRouter.patch('/get-all-friends',authentication,getFriends)

export default friendsRouter;