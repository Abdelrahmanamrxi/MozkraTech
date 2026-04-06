import mongoose from "mongoose"

const connectToDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        
    }
    catch(err){
        console.log(err)
        process.exit(1)
    }

}
export default connectToDB