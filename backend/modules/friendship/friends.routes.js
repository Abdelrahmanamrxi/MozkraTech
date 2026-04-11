import { searchFriends } from "./friends.controller.js";
import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { authentication } from "../../middleware/auth.js";
import { searchFriendSchema } from "./friends.validation.js";
const friendsRouter=Router()
friendsRouter.get('/search',authentication,validation(searchFriendSchema),searchFriends)

export default friendsRouter