import taskModel from "../../DB/models/task.model.js";
import {asyncHandler}  from "../../utils/asyncHandler/index.js";
import HttpException from "../../utils/HttpException.js";

export const createTask=asyncHandler(async (req,res,next)=>{
    const userId=req.user._id
 
    const {subjectId,name,totalHours,priority,dueDate}=req.body

    const task=await taskModel.create({
        userId,
        name,
        subjectId,
        totalHours,
        priority,
        dueDate,
        status:'ongoing'
    })

    res.status(200).json({message:"Task created successfully",task})

})