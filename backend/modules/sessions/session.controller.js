
import taskModel from '../../DB/models/task.model.js'
import sessionModel from '../../DB/models/session.model.js'
import {asyncHandler} from "../../utils/asyncHandler/index.js"
import subjectModel from '../../DB/models/subject.model.js'
import { generateAISessionResponse,generateAvailableSessions } from "../../services/aiResponse.js"
import userModel from '../../DB/models/user.model.js'
import {startOfWeek,endOfWeek} from 'date-fns'
import HttpException from '../../utils/HttpException.js'
import { formatLocalDateTime,toLocalTime } from '../../utils/customHelpers/customHelpers.js'
import { hasSessionConflict } from '../../utils/sessionHelper/sessionHelper.js'

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
    const{dueDate,totalHours,studyHours,subjectId,tzOffsetMinutes}=req.query
    console.log(req.user)
    const userId=req.user._id

    const subject=await subjectModel.findOne({userId,_id:subjectId})
    if(!subject){
        return next(new HttpException("SubjectID must be provided"),400)
    }
        const convertedDate=new Date(dueDate)
        const offsetMinutes = Number(tzOffsetMinutes || 0)


        
        const today = formatLocalDateTime(toLocalTime(new Date()))
        const dueDateLocal = formatLocalDateTime(toLocalTime(convertedDate))
    
    const sessions=await sessionModel.find({userId,endTime:{$lt:convertedDate}})

    const existingSessions=sessions.map((session)=>{
        return {
          startTime: formatLocalDateTime(toLocalTime(new Date(session.startTime))),
          endTime: formatLocalDateTime(toLocalTime(new Date(session.endTime)))
        }
    })

    const name=subject.name
    const user=await userModel.findOne({_id:userId})
    console.log(existingSessions)
    const recommendedSessions = await generateAvailableSessions({
        existingSessions,
        dueDate:dueDateLocal,
        totalHours,
        studyHours,
        subjectId,
        name,
        today,
        freeDays:user.freeDays,
        timeRange:user.preferredTimeRange
    }
);
console.log(recommendedSessions)
    
    res.status(200).json({message:"Generated Sessions Succesfully",recommendedSessions})

})

export const createSchedule=asyncHandler(async(req,res,next)=>{
    const{task,sessions}=req.body
    
    const userId=req.user._id

    task.userId=userId
    const newTask=await taskModel.create(task)

    if(!newTask){
        return next(new HttpException("Task Couldn't Be Created",500))
    }

   const updatedSessions = sessions.map(session => ({
    ...session,
    userId,
    taskId: newTask._id,
    status: "scheduled",
    id: undefined,
    start: undefined,
    end: undefined
    }));

    // Retrieve Old Sessions To Check For no overlaps
    const existingSessions=await sessionModel.find({
        userId,
        status:'scheduled'
    }).select("startTime endTime name")    
    console.log(existingSessions)
    // Checking each session with existing sessions to see if there are overlaps
   for (const session of updatedSessions) {
        hasSessionConflict(existingSessions,session)
    }
// if there isn't proceed to create sessions
   await sessionModel.insertMany(updatedSessions);

   const user=await userModel.findOne({_id:userId})
   user.addXP(50)

    res.status(200).json({message:"Schedule Created Succesfully"})
})

export const getSchedule=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id
    const {date,filter}=req.query
    let query={userId}
    const currentDate=new Date(date)

    const weekStart=startOfWeek(currentDate,{
        weekStartsOn:1
    })
    const weekEnd=endOfWeek(currentDate,{
        weekStartsOn:1
    })
    
    query.startTime={
        $gte:weekStart,
        $lte:weekEnd
    }

    // Add subject filter if provided
    if (filter && filter !== "All") {
        query.subjectId = filter
    }

    const sessions = await sessionModel
        .find(query)
        .populate("taskId")
        .populate("subjectId", "name")
        .sort({ startTime: 1 })

    // Calculate metrics
    let totalHoursThisWeek = 0
    let spentHoursThisWeek = 0
    let todaySessionCount = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrowStart = new Date(today)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)

    sessions.forEach(session => {
        const sessionStart = new Date(session.startTime)
        const sessionEnd = new Date(session.endTime)
        const durationMs = sessionEnd.getTime() - sessionStart.getTime()
        const durationHours = durationMs / (1000 * 60 * 60)
        
        totalHoursThisWeek += durationHours
        if (session.status === "completed") {
            spentHoursThisWeek += durationHours
        }

        // Count sessions for today
        if(sessionStart >= today && sessionStart < tomorrowStart){
            todaySessionCount++
        }
    })

    const days = 7 // Full week
    const avgDailyHours = spentHoursThisWeek / days

    const subjectIds = sessions
        .map((s) => (s.subjectId && s.subjectId._id ? String(s.subjectId._id) : String(s.subjectId || "")))
        .filter(Boolean)

    res.status(200).json({
        message:"Sessions Generated Succesfully",
        sessions,
        weekStart,
        weekEnd,
        metrics:{
            totalHoursThisWeek: Math.round(totalHoursThisWeek * 100) / 100,
            avgDailyHours: Math.round(avgDailyHours * 100) / 100,
            todaySessionCount,
            uniqueSubjects: new Set(subjectIds).size
        }
    })
    
})
export const editSession = asyncHandler(async (req, res, next) => {
    const userId = req.user._id

    const {
        status,
        name,
        startTime,
        endTime,
        sessionId,
        date
    } = req.body.form

    if (!sessionId)
        return next(new HttpException("Provide a session to edit", 400))

    const session = await sessionModel.findOne({
        _id: sessionId,
        userId
    })

    if (!session)
        return next(new HttpException("Session Doesn't Exist", 400))

    if (status !== undefined){
        if(status==="completed"){
            let taskId=session.taskId
            let duration=new Date(session.endTime)-new Date(session.startTime)
            const hours = duration / (1000 * 60 * 60);
            const task=await taskModel.findOneAndUpdate({_id:taskId},{$inc:{hoursSpent:hours}})
            await task.save()
        }
        if(status==="cancelled"){
             await session.deleteOne()
             return res.status(200).json({message: "Session cancelled and deleted"})
        }
        session.status = status
    }

    if (name !== undefined)
        session.name = name

    // Combine date + time
    if (date && startTime) {
        const fullStartDate = new Date(`${date}T${startTime}:00`)
        session.startTime = fullStartDate
    }

    if (date && endTime) {
        const fullEndDate = new Date(`${date}T${endTime}:00`)
        session.endTime = fullEndDate
    }

    await session.save()

    res.status(200).json({
        message: "Session Updated Successfully"
    })
})

export const moveSession = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    const { sessionId, startTime, endTime } = req.body

    if (!sessionId)
        return next(new HttpException("Session ID is required", 400))
    
    if (!startTime || !endTime)
        return next(new HttpException("Start time and end time are required", 400))

    const session = await sessionModel.findOne({
        _id: sessionId,
        userId
    })

    if (!session)
        return next(new HttpException("Session not found", 404))

    // Check for conflicts with other sessions
    const existingSessions = await sessionModel.find({
        userId,
        _id: { $ne: sessionId },
        status: 'scheduled'
    })

    const newStart = new Date(startTime)
    const newEnd = new Date(endTime)

    // Check if the new time slot conflicts with existing sessions
    for (const existing of existingSessions) {
        const existStart = new Date(existing.startTime)
        const existEnd = new Date(existing.endTime)
        
        // Check for overlap
        if (newStart < existEnd && newEnd > existStart) {
            return next(new HttpException("Time slot conflicts with another session", 409))
        }
    }

    session.startTime = newStart
    session.endTime = newEnd
    await session.save()

    res.status(200).json({
        message: "Session moved successfully",
        session
    })
})

