import { notificationModel } from "../../DB/models/notifications.model.js"
import { asyncHandler } from "../../utils/asyncHandler/index.js"

export const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const unreadCount = await notificationModel.countDocuments({
    userId,
    isRead: false,
  })
  res.status(200).json({ unreadCount })
})

export const markNotificationsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const result = await notificationModel.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } },
  )
  res.status(200).json({ modifiedCount: result.modifiedCount })
})

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
    const [data,total] = await Promise.all([
         notificationModel.find(query).limit(limitNum).skip(skip).sort({isRead:1,createdAt:-1}),
         notificationModel.countDocuments(query)
    ])

    const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limitNum)) : 0;
    res.status(200).json({
      notifications: data,
      totalPages,
      totalDocs: total
    })

})