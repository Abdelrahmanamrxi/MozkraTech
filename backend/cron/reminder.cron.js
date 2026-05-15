import cron from 'node-cron'
import sessionModel from '../DB/models/session.model.js'
import userModel from '../DB/models/user.model.js'
import { sendSessionReminder } from '../services/sendEmail.js'
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
