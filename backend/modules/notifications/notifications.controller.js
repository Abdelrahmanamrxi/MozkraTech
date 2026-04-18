import { notificationModel } from "../../DB/models/notifications.model.js"
import { asyncHandler } from "../../utils/asyncHandler/index.js"
import HttpException from "../../utils/HttpException.js"

export const getNotifications=asyncHandler(async (req,res,next)=>{
    
    const userId=req.user._id
    let {limit=10,filter,page=1}=req.query
    
    let query={
        userId
    }
  
    if(filter && filter !== "all"){
        if(filter === 'requests'){
            query.eventType = { $in: ['friend_request_received', 'friend_request_acceptance'] }
        } else {
            query.eventType = filter
        }
    }

    const pageNum=Math.max(1,parseInt(page))
    const limitNum=Math.min(10,parseInt(limit))
    const skip=(pageNum-1)*limitNum
    console.log(query)
    const [data,total] = await Promise.all([
         notificationModel.find(query).limit(limitNum).skip(skip).sort({isRead:1,createdAt:-1}),
         notificationModel.countDocuments(query)
    ])

    if (data.length === 0) {
      return res.status(200).json({message:"There are no notifications"})
    }
  
    const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limitNum)) : 0;
    res.status(200).json({
      notifications: data,
      totalPages,
      totalDocs: total
    })

})