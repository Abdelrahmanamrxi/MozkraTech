import cron from 'node-cron'
import sessionModel from '../DB/models/session.model.js'
import userModel from '../DB/models/user.model.js'
import taskModel from '../DB/models/task.model.js'
import { sendSessionReminder,sendTaskReminder } from '../services/sendEmail.js'

export const remindUserSession=()=>{
    cron.schedule("*/5 * * * *", async ()=>{
        try{

        const now=new Date()
        const thirtyMinLater = new Date(now.getTime() + 30 * 60 * 1000);
            
        const sessions=await sessionModel.find({
            startTime:{
                $gte:now,
                $lte:thirtyMinLater
            },
            reminderSent:false
        }).populate('userId')
        
        for(const session of sessions){
            await sendSessionReminder({to:session.userId.email,subject:"Session Reminder",session:session})
            session.reminderSent=true
            await session.save()
        }
        console.log(`${sessions.length} reminder emails has been sent.`)
    }
    catch(err){
        console.log(err)
    }
    })
}

export const remindUserTask=()=>{
    cron.schedule("*/5 * * * *",async()=>{
    try{

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);  // start of tomorrow
        
        const dayAfter = new Date(tomorrow);
        dayAfter.setDate(tomorrow.getDate() + 1); // start of day after tomorrow
        
        const tasks = await taskModel.find({
            dueDate: {
                $gte: tomorrow,  // from start of tomorrow
                $lt: dayAfter    // up to but not including day after
            },
            reminderSent:false

        }).populate('userId');
        for(const task of tasks){
            await sendTaskReminder({to:task.userId.email,subject:"Task Reminder",task:task})
            if(!task.reminderSent){
                task.reminderSent=true
            }
            await task.save()
        }
        console.log(`${tasks.length} has been sent reminders for them.`)
    }
    catch(err){
        console.log(err)
    }
    })
}
