import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import HttpException from "../../utils/HttpException.js";

// ----------------------------------updateProfile-------------------------------------------
export const updateProfile = asyncHandler(async (req, res, next) => {

    const user = req.user._id;

    const updatedUser = await userModel.updateOne({ _id: user }, req.body);
    return res.status(200).json({ message: "updateProfile success", updatedUser });
})


// ----------------------------------shareProfile-------------------------------------------
export const shareProfile = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const user = await userModel.findOne({_id: id, isDeleted: false, isVerified: true});

    if (!user) {
        return next(new HttpException("User Not Found or Deleted or Not Verified", 404));
    }

    if (req.user._id.toString() === id) {
       return res.status(200).json({ message: "Welcome to your profile", user: req.user });
    }

    const emailExist = await user.viewers.find(viewer => {
        return viewer.userId.toString() === req.user._id.toString();
    });
    if (emailExist) {
        emailExist.time.push(Date.now());
        if (emailExist.time.length > 5) {
        emailExist.time =  emailExist.time.slice(-5);
        }
        
    } else {
        user.viewers.push({ userId: req.user._id, time: [Date.now()]});
    }
    await user.save();
    return res.status(200).json({ message: "share Profile success", user });
})


// ----------------------------------dashboard-------------------------------------------
export const dashboard = asyncHandler(async (req, res, next) => {
    
    const users = await userModel.find({ isDeleted: false });
    return res.status(200).json({ message: "dashboard success", users });
});

// ----------------------------------addFriend-------------------------------------------
export const addFriend = asyncHandler(async (req, res, next) => {

    const { userId } = req.params;
    const [recipient, sender] = await Promise.all([
        userModel.findOneAndUpdate(
            { _id: userId, isDeleted: false, isVerified: true, "friendRequests.received": { $nin: [req.user._id] }, friends: { $nin: [req.user._id] } },
            { $addToSet: { "friendRequests.received": req.user._id } },
            { new: true }
        ),
        userModel.findOneAndUpdate(
        { _id: req.user._id, isDeleted: false, isVerified: true, "friendRequests.sent": { $nin: [userId] } },
        { $addToSet: { "friendRequests.sent": userId } },
        { new: true }
    )
    ]);
    if (!recipient || !sender) {
        return next(new HttpException("User Not Found or request already sent", 404));
    }
    return res.status(200).json({ message: "addFriend success", recipient, sender });
});


// ----------------------------------accept Friend-------------------------------------------
export const acceptFriendRequest = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    
    const [sender, receiver] = await Promise.all([ userModel.findOneAndUpdate(
        { _id: userId, isDeleted: false, isVerified: true, "friendRequests.sent": { $in: [req.user._id ]} },
        {
            $addToSet: { friends: req.user._id },
            $pull: { "friendRequests.sent": req.user._id }},
        { new: true }
    ),
        userModel.findOneAndUpdate(
        { _id: req.user._id, isDeleted: false, isVerified: true, "friendRequests.received": { $in: [userId] } },
        { $addToSet: { friends: userId },
        $pull: { "friendRequests.received": userId } },
        { new: true }
        )
    ]);

    if (!sender || !receiver) {
        return next(new HttpException("User Not Found", 404));
    }

    return res.status(200).json({ message: "friend request accepted successfully", sender, receiver });

});

// ----------------------------------declineFriendRequest-------------------------------------------
export const declineFriendRequest = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const [senderUpdate, receiverUpdate] = await Promise.all([
        userModel.findOneAndUpdate(
            { _id: userId, "friendRequests.sent": req.user._id },
            { $pull: { "friendRequests.sent": req.user._id } },
            { new: true }
        ),
        userModel.findOneAndUpdate(
            { _id: req.user._id, "friendRequests.received": userId },
            { $pull: { "friendRequests.received": userId } },
            { new: true }
        )
    ]);
    if (!senderUpdate || !receiverUpdate) {
        return next(new HttpException("Friend request not found", 404));
    }

    return res.status(200).json({ message: "Friend request declined successfully", senderUpdate, receiverUpdate });
});



// ----------------------------------deleteFriend-------------------------------------------
export const deleteFriend = asyncHandler(async (req, res, next) => {
    const { userId } = req.params; 

    
    const [userUpdate, friendUpdate] = await Promise.all([

        userModel.findOneAndUpdate(
            { _id: req.user._id, friends: { $in: [userId] } }, 
            { $pull: { friends: userId } },
            { new: true }
        ),
        userModel.findOneAndUpdate(
            { _id: userId, friends: { $in: [req.user._id] } },
            { $pull: { friends: req.user._id } },
            { new: true }
        )
    ]);

    if (!userUpdate || !friendUpdate) {
        return next(new HttpException("User is not in your friend list", 404));
    }

    return res.status(200).json({ 
        message: "Friend deleted successfully", 
        user: userUpdate,
        friend: friendUpdate
    });
});


// ----------------------------------getProfile-------------------------------------------
export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOne(
        { _id: req.user._id, isDeleted: false, isVerified: true }
    ).populate([
        { path: "friends" }
    ]);

    if(!user) {
        return next(new HttpException("User Not Found", 404));
    }
    return res.status(200).json({ message: "getUsers success", user });
});


