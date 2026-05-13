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
export const getTasks=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id

    const tasks=await taskModel.find({userId})

    if(!tasks){
        return next(new HttpException("There are no tasks found."))
    }
    res.status(200).json({message:"Tasks sent successfully",tasks})
})