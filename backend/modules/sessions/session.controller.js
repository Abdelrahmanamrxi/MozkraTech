
import taskModel from '../../DB/models/task.model.js'
import sessionModel from '../../DB/models/session.model.js'
import {asyncHandler} from "../../utils/asyncHandler/index.js"
import subjectModel from '../../DB/models/subject.model.js'
import { generateAISessionResponse,generateAvailableSessions } from "../../services/aiResponse.js"
import userModel from '../../DB/models/user.model.js'
import HttpException from '../../utils/HttpException.js'

export const createSession=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id

    const {name,taskId,subjectId,startTime,endTime}=req.body


   const session=await sessionModel.create({
        userId,
        name,
        taskId,
        startTime,
        endTime,
        subjectId,
        status:'scheduled'
    })

    res.status(200).json({mesage:"Session Created",session})
})



export const generateSessions = asyncHandler(async (req, res, next) => {
   
    const { subjects, userPreferences, weeklyDescription } = req.body
    const userId=req.user._id
    const response = await generateAISessionResponse(userId,userPreferences, subjects, weeklyDescription)
    res.status(200).json({ response })
})



export const checkAvailableSessions=asyncHandler(async(req,res,next)=>{
    const{dueDate,totalHours,studyHours,subjectId}=req.query
    console.log(req.user)
    const userId=req.user._id

    const subject=await subjectModel.findOne({userId,_id:subjectId})
    if(!subject){
        return next(new HttpException("SubjectID must be provided"),400)
    }
    const convertedDate=new Date(dueDate)
    
    const sessions=await sessionModel.find({userId,endTime:{$lt:convertedDate}})

    const existingSessions=sessions.map((session)=>{
        return {startTime:session.startTime,endTime:session.endTime}
    })

    const name=subject.name
    console.log(convertedDate,existingSessions,studyHours,subjectId,name)
    const recommendedSessions = await generateAvailableSessions(
  existingSessions,
  convertedDate,
  totalHours,
  studyHours,
  subjectId,
  name
);
    
    res.status(200).json({message:"Generated Sessions Succesfully",recommendedSessions})

})

export const createSchedule=asyncHandler(async(req,res,next)=>{
    const{task,sessions}=req.body
    console.log(task,sessions)
    const userId=req.user._id

    task.userId=userId
    const newTask=await taskModel.create(task)

    if(!newTask){
        return next(new HttpException("Task Couldn't Be Created",500))
    }

    const updatedSessions=sessions.map((session)=>{
        delete session.id
        delete session.start
        delete session.end
        return {...session,userId:userId,taskId:newTask._id,status:"scheduled"}
    })
   await sessionModel.insertMany(updatedSessions);

   const user=await userModel.findOne({_id:userId})
   user.addXP(50)

    res.status(200).json({message:"Schedule Created Succesfully"})
})

export const getSchedule=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id
    const {cursor,filter}=req.query
    let query={}
    if(filter){
        query.filter=filter
    }
    if(cursor){
        query.cursor=cursor
    }
    

})



