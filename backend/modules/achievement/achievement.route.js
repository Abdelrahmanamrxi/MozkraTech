import { Router } from "express";
import { getAchievements } from "./achievement.controller.js";
import { authentication } from "../../middleware/auth.js";
const achievementRouter=Router()

achievementRouter.get('/',authentication,getAchievements)

export default achievementRouter