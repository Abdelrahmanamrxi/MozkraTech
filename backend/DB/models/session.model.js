import mongoose from "mongoose"

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

    completedAt:Date
},{
    timestamps:true
})

sessionSchema.index({userId:1,taskId:1})

const sessionModel=mongoose.model('Session',sessionSchema)





export default sessionModel