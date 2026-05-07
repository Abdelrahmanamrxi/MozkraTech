import scheduleModel from "../../DB/models/schedule.model.js"
import taskModel from '../../DB/models/task.model.js'
import {asyncHandler} from "../../utils/asyncHandler/index.js"
import { generateAIScheduleResponse } from "../../services/aiResponse.js"

export const generateSchedule = asyncHandler(async (req, res, next) => {
   
    const { subjects, userPreferences, weeklyDescription } = req.body
    const response = await generateAIScheduleResponse(userPreferences, subjects, weeklyDescription)
    res.status(200).json({ response })
})