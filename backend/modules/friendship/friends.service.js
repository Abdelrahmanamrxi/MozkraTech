import HttpException from "../../utils/HttpException.js";
import userModel from "../../DB/models/user.model.js";

export async function checkWhetherUsersExist(userId,senderId){
    try{
          const user = await userModel.findOne({
            _id: userId,
            isDeleted: false,
            isVerified: true
          });
        
          if(!user){
            throw new HttpException("User Doesn't Exist",400)
          }
        
          const friend=await userModel.findOne({
            _id:senderId,
            isDeleted:false,
            isVerified:true
          })
           if(!friend){
            throw new HttpException("Sender Doesn't Exist",400)
          }
        return {user,friend}
    }
    catch(err){
        throw err
    }
}