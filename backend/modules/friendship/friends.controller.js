import userModel from "../../DB/models/user.model.js"
import HttpException from "../../utils/HttpException.js"
import { asyncHandler } from "../../utils/asyncHandler/index.js"
import friendshipModel from "../../DB/models/friendship.model.js"
import { notificationModel } from "../../DB/models/notifications.model.js"
import {checkWhetherUsersExist} from "./friends.service.js"
import conversationModel from "../../DB/models/Conversation.model.js"
//------------------------------------------getFriends-------------------------------------------

export const getFriends=asyncHandler(async(req,res,next)=>{
 const userId=req.user._id
 const {search}=req.query
 let query={}

 if(search){
  query.search=search
 }

const friendsList=await friendshipModel.aggregate([
  {
    $match:{
      $or:[{requesterId:userId},{receiverId:userId}],
      status:"accepted"
    }
  },
  {
    $lookup:{
      from:'users',
      localField:"requesterId",
      foreignField:"_id",
      as:'requesterId'
    }
  },
  {
    $lookup:{
      from:'users',
      localField:'receiverId',
      foreignField:"_id",
      as:'receiverId'
    }
  },
  {
    $unwind:"$requesterId"
  },
  {
    $unwind:"$receiverId"
  },
  {
    $addFields:{
      friend:{
        $cond:[{$eq:["$requesterId._id",userId]},"$receiverId","$requesterId"]
      }
    }
  },
  {
    $match:{
      "friend.fullName":{
        $regex:query.search || "",
        $options:'i'
        
      }
      
    }
  },
  {
    $project:{
      friend:{
        _id:1,
        fullName:1,
        updatedAt:1,
        createdAt:1
      },
      conversationId: 1,
      createdAt: 1
    }

  }
])
 const friends = friendsList.map(f => ({
    friendshipId: f._id,
    friend: f.friend,
    createdAt: f.createdAt,
    conversationId: f.conversationId
  }));

res.status(200).json({ friends });
})





export const addFriend = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.body;
  const requesterId = req.user._id;

  if (!receiverId) {
    return next(new HttpException("receiverId is required", 400));
  }

  if (requesterId.toString() === receiverId) {
    return next(new HttpException("You can't add yourself as a friend.", 400));
  }

  const user = await userModel.findOne({
    _id: requesterId,
    isDeleted: false,
    isVerified: true
  });

  if (!user) {
    return next(new HttpException("Requester user not found", 404));
  }

  const receiver = await userModel.findOne({
    _id: receiverId,
    isDeleted: false,
    isVerified: true
  });

  if (!receiver) {
    return next(new HttpException("User not found", 404));
  }

  const existing = await friendshipModel.findOne({
    $or: [
      { receiverId, requesterId },
      { receiverId: requesterId, requesterId: receiverId }
    ]
  });

  if (existing) {
    return next(new HttpException("Friend request already exists", 400));
  }

  const friendship = await friendshipModel.create({
    receiverId,
    requesterId,
    status: "pending"
  });

  user.addXP(30);
  try{
    await notificationModel.create({
      userId:receiverId,
      message:`${user.fullName} has sent you a friend request!`,
      eventType:"friend_request_received",
      payload:{
        senderId:requesterId
      } 
    }) 
  }
  catch(err){
    console.log(err)
  }
  return res.status(201).json({
    message: "Friend Request Sent Successfully",
    friendship
  });
});

export const acceptFriend=asyncHandler(async (req,res,next)=>{
  const userId = req.user._id
  const { senderId } = req.body

  const { user, friend } = await checkWhetherUsersExist(userId, senderId)

  const updated = await friendshipModel.findOneAndUpdate(
    {
      requesterId: senderId,
      receiverId: userId,
      status: "pending"
    },
    {
      $set: { status: "accepted" }
    },
    {
      new: true
    }
  )

  if (!updated) {
    return res.status(200).json({
      message: "Already handled or request not found"
    })
  }

  const conversation = await conversationModel.create({
    participants:[
      {user:userId},
      {user: senderId}
    ],
    participantType:'user-to-user'
  })

  updated.conversationId = conversation._id;
  await updated.save();

  user.addXP(40)

  await notificationModel.findOneAndDelete({
    userId,
    eventType: "friend_request_received",
    "payload.senderId": senderId
  }, { sort: { createdAt: -1 } })

  await notificationModel.create({
    userId: senderId,
    message: `${user.fullName} has accepted your friend request!`,
    eventType: "friend_request_acceptance",
    payload: {
      senderId: userId
    }
  })

  res.status(200).json({ message: "Friendship Accepted." })
})

export const rejectFriend=asyncHandler(async (req,res,next)=>{
  const { senderId } = req.body
  const userId = req.user._id

  const { user, friend } = await checkWhetherUsersExist(userId, senderId)

  const deletedFriendship = await friendshipModel.findOneAndDelete({
    requesterId: senderId,
    receiverId: userId,
    status: "pending"
  })

  await notificationModel.findOneAndDelete({
    userId,
    eventType: "friend_request_received",
    "payload.senderId": senderId
  }, { sort: { createdAt: -1 } })

  if (!deletedFriendship) {
    return res.status(200).json({
      message: "Already handled or request not found"
    })
  }

  res.status(200).json({ message: "User has been rejected." })
})





// // ------------------------------------------getAllFriends-------------------------------------------
// export const getFriends = asyncHandler(async (req, res, next) => {
//   const user = await userModel.findById(req.user._id).populate({
//     path: "friends",
//     select: "fullName email profileImage level currentStreak",
//   });

//   if (!user) {
//     return next(new HttpException("User not found", 404));
//   }

//   res.status(200).json({
//     success: true,
//     friends: user.friends
//   });
// });





// // ------------------------------------------viewProfileFriend-------------------------------------------
// export const viewProfileFriend = asyncHandler(async (req, res, next) => {
//     // 1. Get the friend's ID from URL parameters
//     const { id } = req.params;

//     // 2. Find the friend in the database
//     const friend = await userModel.findOne({ _id: id, isDeleted: false });

//     if (!friend) {
//         return next(new HttpException("Friend profile not found", 404));
//     }

//     // 3. Check if this person is actually in your friends list
//     const isStillFriend = req.user.friends.includes(id);
//     if (!isStillFriend) {
//         return next(new HttpException("You can only view profiles of your friends", 403));
//     }

//     // 4. Viewers Logic: Check if I (req.user._id) visited this friend before
//     const viewerEntry = friend.viewers.find(viewer => {
//         return viewer.userId.toString() === req.user._id.toString();
//     });

//     if (viewerEntry) {
//         // If I visited before, just add a new timestamp
//         viewerEntry.time.push(Date.now());
//         // Keep only the last 5 visit times
//         if (viewerEntry.time.length > 5) {
//             viewerEntry.time = viewerEntry.time.slice(-5);
//         }
//     } else {
//         // If this is my first visit, add my ID to their viewers list
//         friend.viewers.push({ userId: req.user._id, time: [Date.now()] });
//     }

//     // 5. Save the changes to the friend's document
//     await friend.save();

//     // 6. Return the friend's profile data to the frontend
//     return res.status(200).json({ 
//         message: "Viewing friend profile success", 
//         profile: friend 
//     });
// });

