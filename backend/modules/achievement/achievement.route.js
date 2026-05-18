import { Router } from "express";
import { getAchievements, getAllAchievements } from "./achievement.controller.js";
import { authentication } from "../../middleware/auth.js";
const achievementRouter=Router()

achievementRouter.get('/',authentication,getAchievements)
achievementRouter.get('/all',authentication,getAllAchievements)

export default achievementRouter