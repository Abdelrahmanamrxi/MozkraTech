import mongoose from "mongoose"
import HttpException from "../../utils/HttpException.js"
import taskModel from "./task.model.js"

const sessionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    taskId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task",
        required:true
    },

    subjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        required:true
    },
    duration:{
        type:Number
    },
    startTime:{
        type:Date,
        required:true
    },

    endTime:{
        type:Date,
        required:true
    },

    status:{
        type:String,
        enum:["scheduled","completed","missed","cancelled"],
        default:"scheduled"
    },
    completedAt:Date,
    reminderSent:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

sessionSchema.index({userId:1,taskId:1})

sessionSchema.pre('save',async function(next){
    if(!this.isModified("startTime") && !this.isModified("endTime"))
    return 

    if(this.startTime>this.endTime)
    throw new HttpException("End Time must be after Start Time",400)

    if (this.startTime < new Date()) {
    throw new HttpException(
    "Session cannot start before today",
    400
    );
    }

    const collection=await this.constructor.findOne({
        _id:{$ne:this._id},
        userId:this.userId,
        status:{$in:['scheduled']},
        startTime:{$lt:this.endTime},
        endTime:{$gt:this.startTime}
    })
    if(collection)
    throw new HttpException(`Conflict Session Already Exists,${this.startTime} To ${this.endTime} Already Exists`,400)

    const task=await taskModel.findOne({_id:this.taskId})

    if(!task){
        throw new HttpException("Session Cannot Be Created",404)
    }

    if(task.dueDate<this.endTime || task.dueDate<this.startTime){
        throw new HttpException("Session must exist before it's task due date.",400)
    }

})



const sessionModel=mongoose.model('Session',sessionSchema)





export default sessionModel