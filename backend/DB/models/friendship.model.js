import mongoose from "mongoose"

const friendshipSchema=new mongoose.Schema({
    requesterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
    ,
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        required:true
    },
},{

    timestamps:true
})

friendshipSchema.index({receiverId:1,requesterId:1})

const friendshipModel=mongoose.model('Friendship',friendshipSchema)



export default friendshipModel