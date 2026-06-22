
import taskModel from '../../DB/models/task.model.js'
import sessionModel from '../../DB/models/session.model.js'
import {asyncHandler} from "../../utils/asyncHandler/index.js"
import subjectModel from '../../DB/models/subject.model.js'
import achievementModel from '../../DB/models/achievement.model.js'
import { generateAISessionResponse,generateAvailableSessions } from "../../services/aiResponse.js"
import userModel from '../../DB/models/user.model.js'
import {startOfWeek,endOfWeek} from 'date-fns'
import HttpException from '../../utils/HttpException.js'
import { formatLocalDateTime,toLocalTime,toLocalTimeForAI } from '../../utils/customHelpers/customHelpers.js'
import { hasSessionConflict } from '../../utils/sessionHelper/sessionHelper.js'
import { CheckSessionAchievements } from '../achievement/achievement.helper.js'
import incrementWeeklyGoalIfNeeded from '../../utils/weeklyGoal.js'

export const createSession=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id

    const {name,taskId,startTime,endTime,date}=req.body

    const fullStartDate = new Date(`${date}T${startTime}:00`)
    const fullEndDate = new Date(`${date}T${endTime}:00`)

    const task=await taskModel.findOne({_id:taskId}).populate('subjectId')

    const session=await sessionModel.create({
        userId,
        name,
        taskId,
        startTime:fullStartDate,
        endTime:fullEndDate,
        subjectId:task.subjectId._id,
        status: 'scheduled', 
        totalDuration:(fullEndDate.getTime()-fullStartDate.getTime())/(1000*60),
        duration:(fullEndDate.getTime()-fullStartDate.getTime())/(1000*60)
    })

    res.status(200).json({message:"Session Created",session})
})



export const generateSessions = asyncHandler(async (req, res, next) => {
   
    const { subjects, userPreferences, weeklyDescription } = req.body
    const userId=req.user._id
    const response = await generateAISessionResponse(userId,userPreferences, subjects, weeklyDescription)
    res.status(200).json({ response })
})



export const checkAvailableSessions=asyncHandler(async(req,res,next)=>{
    const{dueDate,totalHours,studyHours,subjectId,tzOffsetMinutes}=req.query
    const parsedTotalHours = Number(totalHours)
    const parsedStudyHours = Number(studyHours)
    const userId=req.user._id

    const subject=await subjectModel.findOne({userId,_id:subjectId})
    if(!subject){
        return next(new HttpException("SubjectID must be provided"),400)
    }

    const convertedDate=new Date(dueDate)

    
    const offsetMinutes = -(Number(tzOffsetMinutes || 0)) // negate whatever comes in
    const currentDateTime = formatLocalDateTime(toLocalTimeForAI(new Date(), offsetMinutes))

    const dueDateLocal = formatLocalDateTime(toLocalTimeForAI(convertedDate,offsetMinutes))
  
    const sessions = await sessionModel.find({
    userId,
    startTime: { $gte: new Date() },
    endTime: { $lte: convertedDate }})

    const existingSessions=sessions.map((session)=>{
        return {
          startTime: formatLocalDateTime(toLocalTimeForAI(new Date(session.startTime),offsetMinutes)),
          endTime: formatLocalDateTime(toLocalTimeForAI(new Date(session.endTime),offsetMinutes))
        }
    })
  
    const name=subject.name
    const user=await userModel.findOne({_id:userId})
      console.log(user.preferredTimeRange)
   
    const recommendedSessions = await generateAvailableSessions({
        existingSessions,
        dueDate:dueDateLocal,
        totalHours:parsedTotalHours,
        studyHours:parsedStudyHours,
        subjectId,
        name,
        currentDateTime,
        freeDays:user.freeDays,
        timeRange:user.preferredTimeRange
    }
);
console.log(recommendedSessions)
    
 res.status(200).json({message:"Generated Sessions Successfully",recommendedSessions})

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
    end: undefined, 
    duration: (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60),
    totalDuration:(new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60)
    }));

   
    const existingSessions=await sessionModel.find({
        userId,
        status:'scheduled'
    }).select("startTime endTime name")    

       
        try {
            for (const s of updatedSessions) {
                hasSessionConflict(existingSessions, s)
            }

            await sessionModel.insertMany(updatedSessions);

            const user = await userModel.findOne({ _id: userId })
            if (user) user.addXP(50)

            return res.status(200).json({ message: "Schedule Created Successfully" })
        } catch (err) {
            
            try {
                await taskModel.deleteOne({ _id: newTask._id })
            } catch (e) {
                console.error('Failed to rollback created task after schedule error', e)
            }

            if (err instanceof HttpException) return next(err)
            return next(new HttpException(err.message || 'Failed to create schedule', 400))
        }
})
export const getSchedule = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    const { date, filter } = req.query

    let query = { userId }

    const currentDate = new Date(date)

    const weekStart = startOfWeek(currentDate, {
        weekStartsOn: 1
    })

    const weekEnd = endOfWeek(currentDate, {
        weekStartsOn: 1
    })

    query.startTime = {
        $gte: weekStart,
        $lte: weekEnd
    }

    if (filter && filter !== "All") {
        query.subjectId = filter
    }

    const sessions = await sessionModel
        .find(query)
        .populate("taskId")
        .populate("subjectId", "name")
        .sort({ startTime: 1 })

    const tasks = await taskModel
        .find({ userId })
        .populate("subjectId", "name")
        .sort({ dueDate: 1, createdAt: 1 })

    let totalHoursThisWeek = 0
    let spentHoursThisWeek = 0
    let todaySessionCount = 0
    let totalMismatchMinutes = 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrowStart = new Date(today)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)

    // ---------------- LOOP ----------------
    sessions.forEach(session => {
        const sessionStart = new Date(session.startTime)

        const status = session.status?.toLowerCase().trim()

        const plannedHours = session.totalDuration / 60
        totalHoursThisWeek += plannedHours

        // ✅ spentHoursThisWeek = scheduled sessions with actual duration
        if (status === "scheduled" && session.duration != null) {
            spentHoursThisWeek += session.duration / 60
        }

        // 📊 avgDaily = only count mismatches (duration !== totalDuration) or completed sessions
        if (
            (session.duration != null && session.duration !== session.totalDuration)
            || status === "completed"
        ) {
            totalMismatchMinutes +=
                Math.abs(session.totalDuration - (session.duration || 0))
        }

        // today scheduled sessions
        if (
            sessionStart >= today &&
            sessionStart < tomorrowStart &&
            status === "scheduled"
        ) {
            todaySessionCount++
        }
    })

    // ---------------- DAYS WITH MISMATCHES ----------------
    const daysWithMismatch = new Set(
        sessions
            .filter(
                s =>
                    (s.duration != null && s.duration !== s.totalDuration)
                    || s.status?.toLowerCase().trim() === "completed"
            )
            .map(s =>
                new Date(s.startTime)
                    .toISOString()
                    .split("T")[0]
            )
    )

    // ---------------- AVG DAILY ----------------
    // Average mismatch per day (only for days with mismatches/completions)
    const avgDailyHours =
        (totalMismatchMinutes / 60) /
        (daysWithMismatch.size || 1)

    const avgDailyWholeHours = Math.floor(avgDailyHours)
    const avgDailyMinutes = Math.round(
        (avgDailyHours - avgDailyWholeHours) * 60
    )

    // ---------------- SUBJECTS ----------------
    const subjectIds = sessions
        .map(s =>
            s.subjectId && s.subjectId._id
                ? String(s.subjectId._id)
                : String(s.subjectId || "")
        )
        .filter(Boolean)

    // ---------------- RESPONSE ----------------
    res.status(200).json({
        message: "Sessions Generated Successfully",
        sessions,
        tasks,
        weekStart,
        weekEnd,
        metrics: {
            totalHoursThisWeek:
                Math.round(totalHoursThisWeek * 100) / 100,

            // ✅ scheduled only actual usage
            spentHoursThisWeek:
                Math.round(spentHoursThisWeek * 100) / 100,

            // 📊 avg daily mismatch (only days with mismatches or completions)
            avgDailyHours:
                Math.round(avgDailyHours * 100) / 100,

            avgDailyFormatted:
                avgDailyWholeHours > 0
                    ? `${avgDailyWholeHours}h ${avgDailyMinutes}m`
                    : `${avgDailyMinutes}m`,

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
            session.duration=0
            let taskId=session.taskId
            let duration=new Date(session.endTime)-new Date(session.startTime)
            const hours = duration / (1000 * 60 * 60);

            const task=await taskModel.findOneAndUpdate({_id:taskId},{$inc:{hoursSpent:hours}})
            
            // Auto-complete task if hoursSpent >= totalHours
            if(task && task.hoursSpent + hours >= task.totalHours){
                await taskModel.findOneAndUpdate(
                    {_id:taskId},
                    {status:'completed', completedAt:new Date()}
                )
            }
            
            session.status=status

            await session.save()
            await CheckSessionAchievements(userId);
            await incrementWeeklyGoalIfNeeded(userId);

            return res.status(200).json({message:"Session Completed Successfully",session})
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
    if(date && (startTime || endTime)){
        const duration=Math.floor((session.endTime - session.startTime) / (1000 * 60))
        session.totalDuration=duration
      if(session.status !== "completed") {
        session.duration = duration
    }
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

export const deleteSession=asyncHandler(async(req,res,next)=>{
    const {sessionId}=req.params
    
    const session = await sessionModel.findOneAndDelete({_id:sessionId})
    if (!session) {
    return next(
      new HttpException("Couldn't find session matching your criteria", 404)
    );
  }

    res.status(200).json({message:"Session Deleted Successfully"})

})

export const getSessions=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id
    const sessions=await sessionModel.find({
        status:'scheduled',
        userId,
    }).sort({ startTime: 1 })
    if(!sessions){
       return next(new HttpException("Please start creating your sessions to start studying with timer mode."))
    }
    res.status(200).json({message:"Sessions Retrieved Successfully",sessions})
})


export const updateSession = asyncHandler(async (req, res, next) => { 
    const { sessionId, actualDuration } = req.body;

    const session = await sessionModel.findOne({ _id: sessionId, userId: req.user._id });
    if (!session) return next(new HttpException("Session not found", 404));
    
    if (session.status == "completed") {
        return res.status(200).json({ message: "Session is already completed", session });
    }
    else if (actualDuration >= session.totalDuration) {
        session.duration = 0;
        session.status = "completed";
        session.completedAt = new Date();

        await session.save();
        
        const task = await taskModel.findOneAndUpdate({_id:session.taskId},{$inc:{hoursSpent:session.totalDuration}})
        
        // Auto-complete task if hoursSpent >= totalHours
        if(task && task.hoursSpent + session.totalDuration >= task.totalHours){
            await taskModel.findOneAndUpdate(
                {_id:session.taskId},
                {status:'completed', completedAt:new Date()}
            )
        }
        
        await CheckSessionAchievements(session.userId);
        await incrementWeeklyGoalIfNeeded(session.userId);

        return res.status(200).json({ message: "Session marked as completed", session });
    }
    else { 
        const remainingDuration = session.duration - actualDuration;
        session.duration = Number(Math.max(0, remainingDuration).toFixed(2));
        await session.save();
        return res.status(200).json({ message: "Session duration updated", session });
    }

})
