import userModel from "../../DB/models/user.model.js"
import HttpException from "../../utils/HttpException.js"
import { asyncHandler } from "../../utils/asyncHandler/index.js"




export const searchFriends=asyncHandler(async(req,res,next)=>{
    const{limit=3,page=1,name}=req.query


    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(10, parseInt(limit));
    const skip=(pageNum-1)*limit
    const filter=name?{fullName:{$regex:name,$options:'i'}}:{}
    const [data, total] = await Promise.all([
    userModel.find(filter)
      .sort({ createdAt: -1 })
      .select("fullName email _id level")
      .skip(skip)
      .limit(limitNum),
    userModel.countDocuments({fullName:name})
  ]);

    if(data.length===0){
        return next(new HttpException("There is no user with such criteira"),404)
    }
    res.status(200).json({
        data,
        totalPages:Math.ceil(total/limitNum),
        totalPeople:total

    })
})

