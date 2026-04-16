import mongoose from 'mongoose'
const notificationSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    },
    message:{
        type:String,
        required:true
    },
    eventType:{
        type:String,
        required:true,
        enum:[ 
    'friend_request_received',
    'message_received',
    'system_announcement',
    'streak_milestone_reached',
    'achievement_unlocked'],
    index:true
    },
    isRead:{
        type:Boolean,
        default:false
    },
    readAt:{
        type:Date
    },
    payload:{
        type:Object,
        default:{},
        
    }
},{timestamps:true});
{/**
    Payload added for flexible data ex : 
      Examples:
      { senderId: '...' } for friend requests
      { chatId: '...', messageId: '...' } for messages recieved
      { achievementId: '...' } for achievements
    
    */}

notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 10 }) // Deletes notifications after 10 mins for testing
notificationSchema.index({userId:1,createdAt:-1})
notificationSchema.index({userId:1,isRead:1})

export const notificationModel=mongoose.model('Notification',notificationSchema)