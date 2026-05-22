import taskModel from "../../DB/models/task.model.js";
import sessionModel from "../../DB/models/session.model.js";
import {asyncHandler}  from "../../utils/asyncHandler/index.js";
import HttpException from "../../utils/HttpException.js";
import incrementWeeklyGoalIfNeeded from '../../utils/weeklyGoal.js'

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

export const updateTask=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id
    const taskId=req.params.taskId
    const {name,dueDate,priority,subjectId,totalHours,status}=req.body

    const task=await taskModel.findOne({_id:taskId,userId})
    
    if(!task){
        return next(new HttpException("Task not found",404))
    }

    // Prevent changing completed tasks back to ongoing
    if(task.status === 'completed' && status === 'ongoing'){
        return next(new HttpException("Cannot revert a completed task back to ongoing",400))
    }

    // If updating dueDate, validate that no sessions end after the new dueDate
    if(dueDate && new Date(dueDate) < new Date()){
        return next(new HttpException("Due date cannot be in the past",400))
    }

    if(dueDate && status!=="completed"){
        const sessionAfterDue=await sessionModel.findOne({
            taskId,
            userId,
            endTime:{$gt:new Date(dueDate)}
        })
        
        if(sessionAfterDue){
            return next(new HttpException("Due date cannot be before session end times",400))
        }
    }

    // Update task fields
    if(name) task.name=name
    if(dueDate) task.dueDate=dueDate
    if(priority) task.priority=priority
    if(subjectId) task.subjectId=subjectId
    if(totalHours) task.totalHours=totalHours
    
    // Handle status changes
    if(status !== undefined){
        if(status === 'completed'){
            task.status = 'completed'
            task.hoursSpent = task.totalHours
            task.completedAt = new Date()
            
            // Cascade: mark all related sessions as completed
            await sessionModel.updateMany(
                { taskId: task._id },
                { status: 'completed', completedAt: new Date() }
            )
        }
    }

    await task.save()
    // After task completion, evaluate weekly goal increment
    if(status === 'completed'){
        await incrementWeeklyGoalIfNeeded(userId)
    }

    res.status(200).json({message:"Task updated successfully",task})
})

export const confirmTask=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id
    const taskId=req.params.taskId

    const task=await taskModel.findOne({_id:taskId,userId})
    
    if(!task){
        return next(new HttpException("Task not found",404))
    }

    task.status='completed'
    task.completedAt=new Date()

    await task.save()
    await incrementWeeklyGoalIfNeeded(userId)

    res.status(200).json({message:"Task marked as completed",task})
})

export const deleteTask=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id
    const taskId=req.params.taskId

    const task=await taskModel.findOne({_id:taskId,userId})
    
    if(!task){
        return next(new HttpException("Task not found",404))
    }

    // Cascade delete sessions related to this task
    await sessionModel.deleteMany({taskId,userId})

    await taskModel.deleteOne({_id:taskId})

    res.status(200).json({message:"Task deleted successfully"})
})