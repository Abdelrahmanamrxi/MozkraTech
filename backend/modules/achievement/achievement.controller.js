import { asyncHandler } from "../../utils/asyncHandler/index.js"
import HttpException from "../../utils/HttpException.js";
import achievementModel from "../../DB/models/achievement.model.js";
import { getAchievementCatalog } from "./achievement.helper.js";

export const getAchievements=asyncHandler(async(req,res,next)=>{
    const{limit}=req.query
    const userId=req.user._id

     const query = achievementModel.find({ userId });
     if (limit) query.limit(parseInt(limit));

    const achievements = await query;

    res.status(200).json({message:"Achievements Retrieved Successfuly",achievements})
})

export const getAllAchievements=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id
    
    const achievements = await getAchievementCatalog(userId);
    
    res.status(200).json({
        message:"All Achievements Retrieved Successfully",
        achievements
    })
})