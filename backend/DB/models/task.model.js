import mongoose from 'mongoose'

const taskSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    subjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subject',
        required:true
    },
    status:{
        type:String,
        enum:["ongoing","completed"],
        default:"ongoing"
    },
    // This the due date for the task not the session ! (eg. Calculus )
    dueDate:{
        type:Date,
        required:true
    },
    // Tracking hours for the whole TASK
    totalHours:{
        type:Number,
        required:true,
        min:1
    },
    priority:{
        type:String,
        enum:['low','medium','high'],
        default:"medium"
    },
    // When was the whole task finished.
    completedAt:{
        type:Date
    },

    // Hours Spent on The Whole Task
    hoursSpent:{
        type:Number,
        default:0
    }

},{timestamps:true})

taskSchema.index({userId:1,subjectId:1})

const taskModel=mongoose.model("Task",taskSchema)
export default taskModel