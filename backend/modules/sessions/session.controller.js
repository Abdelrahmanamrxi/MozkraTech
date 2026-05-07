
import taskModel from '../../DB/models/task.model.js'
import sessionModel from '../../DB/models/session.model.js'
import {asyncHandler} from "../../utils/asyncHandler/index.js"
import { generateAISessionResponse } from "../../services/aiResponse.js"


export const generateSessions = asyncHandler(async (req, res, next) => {
   
    const { subjects, userPreferences, weeklyDescription } = req.body
    const response = await generateAISessionResponse(userPreferences, subjects, weeklyDescription)
    res.status(200).json({ response })
})

export const checkAvailableSessions=asyncHandler(async(req,res,next)=>{
    const {totalHours,priority,dueDate,}=req.body
    const userId=req.user._id

    const user=await User.findOne({_id:userId})

    const sessionModel=await sessionModel.findOne({userId})
    


})

