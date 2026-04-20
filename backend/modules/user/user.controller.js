import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import HttpException from "../../utils/HttpException.js";
import friendshipModel from "../../DB/models/friendship.model.js";
import { notificationModel } from "../../DB/models/notifications.model.js";
// ----------------------------------updateProfile-------------------------------------------
export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = req.user._id;

  const updatedUser = await userModel.updateOne({ _id: user }, req.body);
  return res
    .status(200)
    .json({ message: "updateProfile success", updatedUser });
});

// ----------------------------------updateStudyPreferences-------------------------------------------
export const updateStudyPreferences = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const {
    sessionDuration,
    breakDuration,
    preferredTime,
    weeklyGoalHours,
    weeklyStudyHours,
  } = req.body;

  const update = {};
  if (sessionDuration !== undefined)
    update["timer.sessionDuration"] = sessionDuration;
  if (breakDuration !== undefined)
    update["timer.breakDuration"] = breakDuration;
  if (preferredTime !== undefined) update.preferredTime = preferredTime;
  if (weeklyGoalHours !== undefined) update.weeklyGoalHours = weeklyGoalHours;
  if (weeklyStudyHours !== undefined)
    update.weeklyStudyHours = weeklyStudyHours;

  if (Object.keys(update).length === 0) {
    return next(new HttpException("No study preferences provided", 400));
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true },
  );

  return res.status(200).json({
    message: "Study preferences updated successfully",
    user: updatedUser,
  });
});

// Search For Users

export const searchForUsers = asyncHandler(async (req, res, next) => {
  const { limit = 3, page = 1, name } = req.query;
  const userId = req.user._id;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(10, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;
  const filter = name
    ? { fullName: { $regex: name, $options: "i" }, _id: { $ne: userId } }
    : {};
  const [data, total] = await Promise.all([
    userModel
      .find(filter)
      .sort({ createdAt: -1 })
      .select("fullName email _id level")
      .skip(skip)
      .limit(limitNum),
    userModel.countDocuments(filter),
  ]);

  if (data.length === 0) {
    return next(new HttpException("There is no user with such criteria"), 404);
  }

  const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limitNum)) : 0;

  res.status(200).json({
    people: data,
    totalPages,
    totalDocs: total,
  });
});

export const getProfileByID = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const ownUserId = req.user._id;

  if (ownUserId.toString() === id.toString()) {
    return next(
      new HttpException(
        "You cannot access your own profile through this endpoint",
        403,
      ),
    );
  }

  const user = await userModel
    .findOne({ _id: id, isDeleted: false, isVerified: true })
    .select(
      "level fullName currentXP currentStreak createdAt bio summary subjects viewers",
    )
    .populate("subjects", "name");

  if (!user) {
    return next(
      new HttpException("User Not Found or Deleted or Not Verified", 404),
    );
  }

  // ---------------- friendship check ----------------
  const friendship = await friendshipModel.findOne({
    $or: [
      { requesterId: ownUserId, receiverId: id },
      { receiverId: ownUserId, requesterId: id },
    ],
  });

  const isFriend = friendship?.status === "accepted";
  const isPending = friendship?.status === "pending";

  // ---------------- viewer tracking ----------------

  const viewerUser = await userModel.findById(ownUserId);

  if (!viewerUser) return;

  // find existing viewer record
  const existingViewer = user.viewers.find(
    (v) => v.userId.toString() === ownUserId.toString(),
  );

  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  let shouldNotify = false;

  if (!existingViewer) {
    // first time view
    user.viewers.push({
      userId: ownUserId,
      time: [now],
    });

    shouldNotify = true;
  } else {
    // update time history
    existingViewer.time.push(now);

    if (existingViewer.time.length > 5) {
      existingViewer.time = existingViewer.time.slice(-5);
    }

    const lastViewTime = existingViewer.time.at(-2);
    // ⚠️ important: previous view, not current push

    shouldNotify = !lastViewTime || now - lastViewTime > TEN_MINUTES;
  }

  // save viewer update ONCE
  await user.save();

  // single notification block
  if (shouldNotify) {
    await notificationModel.create({
      userId: user._id,
      message: `${viewerUser.fullName} viewed your profile!`,
      eventType: "view_profile",
      payload: {
        viewerId: ownUserId,
      },
    });
  }

  await user.save();

  // Sending Data specific to different usecases whether User is
  // friends or still pending or not friends

  let safeUser;

  if (isFriend) {
    safeUser = {
      fullName: user.fullName,
      level: user.level,
      currentXP: user.currentXP,
      currentStreak: user.currentStreak,
      createdAt: user.createdAt,
      bio: user.bio,
      summary: user.summary,
      subjects: user.subjects,
    };
  } else if (isPending) {
    safeUser = {
      fullName: user.fullName,
      bio: user.bio,
      summary: user.summary,
      createdAt: user.createdAt,
      subjects: [],
    };
  } else {
    safeUser = {
      fullName: user.fullName,
      createdAt: user.createdAt,
      bio: "Hidden",
      summary: "Hidden",
      subjects: [],
    };
  }

  return res.status(200).json({
    message: "User Profile Loaded",
    data: {
      user: safeUser,
      friendship,
      isFriend,
      isPending,
    },
  });
});
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
      {
        _id: userId,
        isDeleted: false,
        isVerified: true,
        "friendRequests.received": { $nin: [req.user._id] },
        friends: { $nin: [req.user._id] },
      },
      { $addToSet: { "friendRequests.received": req.user._id } },
      { new: true },
    ),
    userModel.findOneAndUpdate(
      {
        _id: req.user._id,
        isDeleted: false,
        isVerified: true,
        "friendRequests.sent": { $nin: [userId] },
      },
      { $addToSet: { "friendRequests.sent": userId } },
      { new: true },
    ),
  ]);
  if (!recipient || !sender) {
    return next(
      new HttpException("User Not Found or request already sent", 404),
    );
  }
  return res
    .status(200)
    .json({ message: "addFriend success", recipient, sender });
});

// ----------------------------------accept Friend-------------------------------------------
export const acceptFriendRequest = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const [sender, receiver] = await Promise.all([
    userModel.findOneAndUpdate(
      {
        _id: userId,
        isDeleted: false,
        isVerified: true,
        "friendRequests.sent": { $in: [req.user._id] },
      },
      {
        $addToSet: { friends: req.user._id },
        $pull: { "friendRequests.sent": req.user._id },
      },
      { new: true },
    ),
    userModel.findOneAndUpdate(
      {
        _id: req.user._id,
        isDeleted: false,
        isVerified: true,
        "friendRequests.received": { $in: [userId] },
      },
      {
        $addToSet: { friends: userId },
        $pull: { "friendRequests.received": userId },
      },
      { new: true },
    ),
  ]);

  if (!sender || !receiver) {
    return next(new HttpException("User Not Found", 404));
  }

  return res.status(200).json({
    message: "friend request accepted successfully",
    sender,
    receiver,
  });
});

// ----------------------------------declineFriendRequest-------------------------------------------
export const declineFriendRequest = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const [senderUpdate, receiverUpdate] = await Promise.all([
    userModel.findOneAndUpdate(
      { _id: userId, "friendRequests.sent": req.user._id },
      { $pull: { "friendRequests.sent": req.user._id } },
      { new: true },
    ),
    userModel.findOneAndUpdate(
      { _id: req.user._id, "friendRequests.received": userId },
      { $pull: { "friendRequests.received": userId } },
      { new: true },
    ),
  ]);
  if (!senderUpdate || !receiverUpdate) {
    return next(new HttpException("Friend request not found", 404));
  }

  return res.status(200).json({
    message: "Friend request declined successfully",
    senderUpdate,
    receiverUpdate,
  });
});

// ----------------------------------deleteFriend-------------------------------------------
export const deleteFriend = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const [userUpdate, friendUpdate] = await Promise.all([
    userModel.findOneAndUpdate(
      { _id: req.user._id, friends: { $in: [userId] } },
      { $pull: { friends: userId } },
      { new: true },
    ),
    userModel.findOneAndUpdate(
      { _id: userId, friends: { $in: [req.user._id] } },
      { $pull: { friends: req.user._id } },
      { new: true },
    ),
  ]);

  if (!userUpdate || !friendUpdate) {
    return next(new HttpException("User is not in your friend list", 404));
  }

  return res.status(200).json({
    message: "Friend deleted successfully",
    user: userUpdate,
    friend: friendUpdate,
  });
});

// ----------------------------------getProfile-------------------------------------------
export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    _id: req.user._id,
    isDeleted: false,
    isVerified: true,
  });

  if (!user) {
    return next(new HttpException("User Not Found", 404));
  }

  const friendships = await friendshipModel
    .find({
      status: "accepted",
      $or: [{ requesterId: user._id }, { receiverId: user._id }],
    })
    .populate([
      { path: "requesterId", select: "fullName image email" },
      { path: "receiverId", select: "fullName image email" },
    ]);

  const friendsList = friendships.map((f) => {
    return f.requesterId._id.toString() === user._id.toString()
      ? f.receiverId
      : f.requesterId;
  });

  return res.status(200).json({
    message: "getUsers success",
    user: {
      ...user._doc,
      friends: friendsList,
    },
  });
});
