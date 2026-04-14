import userModel from "../../DB/models/user.model.js"
import HttpException from "../../utils/HttpException.js"
import { asyncHandler } from "../../utils/asyncHandler/index.js"
import friendshipModel from "../../DB/models/friendship.model.js"


//------------------------------------------searchFriends-------------------------------------------
export const searchFriends=asyncHandler(async(req,res,next)=>{
    const{limit=3,page=1,name}=req.query
    const userId=req.user._id

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(10, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;
    const filter = name ? { fullName: { $regex: name, $options: 'i' }, _id: { $ne: userId } } : {};
    const [data, total] = await Promise.all([
      userModel.find(filter)
        .sort({ createdAt: -1 })
        .select("fullName email _id level")
        .skip(skip)
        .limit(limitNum),
      userModel.countDocuments(filter)
    ]);

    if (data.length === 0) {
      return next(new HttpException("There is no user with such criteria"), 404);
    }

    const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limitNum)) : 0;

    res.status(200).json({
      people: data,
      totalPages,
      totalDocs: total
    })
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
  

  return res.status(201).json({
    message: "Friend Request Sent Successfully",
    friendship
  });
});


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

