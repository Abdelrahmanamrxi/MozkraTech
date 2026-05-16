
import mongoose from 'mongoose'

const achievementSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:['streak','friendship','session'],
        required:true
    },
    badge:{
        type:String,
        enum:['common','rare','epic','legendary'],
        required:true,
    },

},{timeStamps:true})

const achievementModel=mongoose.model('Achievement',achievementSchema)
export default achievementModel