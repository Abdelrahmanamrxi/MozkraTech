import userModel from "../../DB/models/user.model.js"
import HttpException from "../../utils/HttpException.js"
import { asyncHandler } from "../../utils/asyncHandler/index.js"
import friendshipModel from "../../DB/models/friendship.model.js"
import { notificationModel } from "../../DB/models/notifications.model.js"
import { checkWhetherUsersExist,sortLeaderboard } from "./friends.service.js"
import conversationModel from "../../DB/models/Conversation.model.js"
import achievementModel from "../../DB/models/achievement.model.js"
import { checkFriendshipAchievements } from "../achievement/achievement.helper.js"
import taskModel from "../../DB/models/task.model.js"
import subjectModel from "../../DB/models/subject.model.js"
//------------------------------------------getFriends-------------------------------------------

export const getFriends = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { search } = req.query;
  let query = {};

  if (search) {
    query.search = search;
  }

  const friendsList = await friendshipModel.aggregate([
    {
      $match: {
        $or: [{ requesterId: userId }, { receiverId: userId }],
        status: "accepted",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "requesterId",
        foreignField: "_id",
        as: "requesterId",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "receiverId",
        foreignField: "_id",
        as: "receiverId",
      },
    },
    {
      $unwind: "$requesterId",
    },
    {
      $unwind: "$receiverId",
    },
    {
      $addFields: {
        friend: {
          $cond: [
            { $eq: ["$requesterId._id", userId] },
            "$receiverId",
            "$requesterId",
          ],
        },
      },
    },
    {
      $match: {
        "friend.fullName": {
          $regex: query.search || "",
          $options: "i",
        },
      },
    },
    {
      $lookup: {
        from: "conversations",
        localField: "conversationId",
        foreignField: "_id",
        as: "conversation",
      },
    },
    {
      $unwind: {
        path: "$conversation",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "messages",
        let: { convId: "$conversationId", viewerId: userId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$conversationId", "$$convId"] },
                  {
                    $not: {
                      $in: ["$$viewerId", { $ifNull: ["$deletedFor", []] }],
                    },
                  },
                ],
              },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $limit: 1,
          },
          {
            $project: {
              _id: 1,
              content: {
                $cond: ["$isDeletedForAll", "", "$content"],
              },
              senderId: 1,
              isRead: 1,
              createdAt: 1,
              isDeletedForAll: 1,
              deletedAt: 1,
              deletedBy: 1,
            },
          },
        ],
        as: "lastMessage",
      },
    },
    {
      $addFields: {
        unReadCount: {
          $ifNull: [
            {
              $getField: {
                field: "unReadCount",
                input: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$conversation.participants",
                        cond: { $eq: ["$$this.user", userId] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
            0,
          ],
        },
        lastMessage: {
          $arrayElemAt: ["$lastMessage", 0],
        },
      },
    },
    {
      $project: {
        friend: {
          _id: 1,
          fullName: 1,
          updatedAt: 1,
          createdAt: 1,
          lastActivityDate: 1,
          level:1,
          profileImage:1
        },
        conversationId: 1,
        createdAt: 1,
        unReadCount: 1,
        lastMessage: 1,
      },
    },
  ]);
  const friends = friendsList.map((f) => ({
    friendshipId: f._id,
    friend: f.friend,
    createdAt: f.createdAt,
    conversationId: f.conversationId,
    unReadCount: f.unReadCount,
    lastMessage: f.lastMessage || null,
  }));

  res.status(200).json({ friends });
});

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
    isVerified: true,
  });

  if (!user) {
    return next(new HttpException("Requester user not found", 404));
  }

  const receiver = await userModel.findOne({
    _id: receiverId,
    isDeleted: false,
    isVerified: true,
  });

  if (!receiver) {
    return next(new HttpException("User not found", 404));
  }

  const existing = await friendshipModel.findOne({
    $or: [
      { receiverId, requesterId },
      { receiverId: requesterId, requesterId: receiverId },
    ],
  });

  if (existing) {
    return next(new HttpException("Friend request already exists", 400));
  }

  const friendship = await friendshipModel.create({
    receiverId,
    requesterId,
    status: "pending",
  });

  user.addXP(30);
  try {
    await notificationModel.create({
      userId: receiverId,
      message: `${user.fullName} has sent you a friend request!`,
      eventType: "friend_request_received",
      payload: {
        senderId: requesterId,
      },
    });
  } catch (err) {
    console.log(err);
  }
  return res.status(201).json({
    message: "Friend Request Sent Successfully",
    friendship,
  });
});

export const acceptFriend = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { senderId } = req.body;

  const { user, friend } = await checkWhetherUsersExist(userId, senderId);

  const updated = await friendshipModel.findOneAndUpdate(
    {
      requesterId: senderId,
      receiverId: userId,
      status: "pending",
    },
    {
      $set: { status: "accepted" },
    },
    {
      new: true,
    },
  );

  if (!updated) {
    return res.status(200).json({
      message: "Already handled or request not found",
    });
  }

  const conversation = await conversationModel.create({
    participants: [{ user: userId }, { user: senderId }],
    participantType: "user-to-user",
  });

  updated.conversationId = conversation._id;
  await updated.save();

  user.addXP(40)
  await Promise.all([
    await checkFriendshipAchievements(userId),
    await checkFriendshipAchievements(senderId)
  ])

  await notificationModel.findOneAndDelete(
    {
      userId,
      eventType: "friend_request_received",
      "payload.senderId": senderId,
    },
    { sort: { createdAt: -1 } },
  );

  await notificationModel.create({
    userId: senderId,
    message: `${user.fullName} has accepted your friend request!`,
    eventType: "friend_request_acceptance",
    payload: {
      senderId: userId,
    },
  });

  res.status(200).json({ message: "Friendship Accepted." });
});

export const rejectFriend = asyncHandler(async (req, res, next) => {
  const { senderId } = req.body;
  const userId = req.user._id;

  const { user, friend } = await checkWhetherUsersExist(userId, senderId);

  const deletedFriendship = await friendshipModel.findOneAndDelete({
    requesterId: senderId,
    receiverId: userId,
    status: "pending",
  });

  await notificationModel.findOneAndDelete(
    {
      userId,
      eventType: "friend_request_received",
      "payload.senderId": senderId,
    },
    { sort: { createdAt: -1 } },
  );

  if (!deletedFriendship) {
    return res.status(200).json({
      message: "Already handled or request not found",
    });
  }

  res.status(200).json({ message: "User has been rejected." });
});


export const getLeaderboard=asyncHandler(async(req,res,next)=>{
const sortBy = req.query.sortBy || 'overallProgress'; 
const userId = req.user._id;
const me = userId.toString();

const friends = await friendshipModel.find({
  $or: [{ requesterId: userId }, { receiverId: userId }],
  status: 'accepted'
})
.populate('requesterId', 'name profileImage currentStreak longestStreak currentXP level fullName weeklyStudyHours')
.populate('receiverId',  'name profileImage currentStreak longestStreak currentXP level fullName weeklyStudyHours');


const userMap = new Map();

friends.forEach(f => {
  for (const user of [f.requesterId, f.receiverId]) {
    const id = user._id.toString();
    if (!userMap.has(id)) {
      userMap.set(id, {
        _id:              user._id,
        name:             user.name,
        fullName:         user.fullName,
        profileImage:     user.profileImage,
        currentStreak:    user.currentStreak,
        longestStreak:    user.longestStreak,
        currentXP:        user.currentXP,
        level:            user.level,
        weeklyStudyHours: user.weeklyStudyHours,
        isMe:             id === me
      });
    }
  }
});

const uniquePeople = Array.from(userMap.values());
const userIds = uniquePeople.map(u => u._id);


const tasks = await taskModel.find({ userId: { $in: userIds } });


const taskStatsMap = new Map();

tasks.forEach(task => {
  const id = task.userId.toString();

  if (!taskStatsMap.has(id)) {
    taskStatsMap.set(id, { hoursSpent: 0, totalHours: 0 });
  }

  const stats = taskStatsMap.get(id);
  stats.hoursSpent += task.hoursSpent  || 0;
  stats.totalHours += task.totalHours  || 0;
});

// Merge user profile + task stats
const leaderboard = uniquePeople.map(user => {
  const stats = taskStatsMap.get(user._id.toString()) || { hoursSpent: 0, totalHours: 0 };

  return {
    ...user,
    hoursSpent:  stats.hoursSpent,
    totalHours:  stats.totalHours,
  };
});

// Sort — pick your primary metric (or expose all 4 and let the client sort)
const sortWay = sortLeaderboard[sortBy] ?? sortLeaderboard.overallProgress;
leaderboard.sort(sortWay)
res.status(200).json({leaderboard})
})

export const compareFriendProgress=asyncHandler(async(req,res,next)=>{
  const userId = req.user._id
  const { friendId } = req.params

  const [me, friend] = await Promise.all([
    userModel.findOne({ _id: userId, isDeleted: false, isVerified: true }),
    userModel.findOne({ _id: friendId, isDeleted: false, isVerified: true }),
  ])

  if (!friend) {
    return next(new HttpException("There is no user matching your criteria.", 404))
  }

  if (!me) {
    return next(new HttpException("Current user not found.", 404))
  }

  const [
    myTasks,
    friendsTasks,
    mySubjects,
    friendSubjects,
    myAchievementCount,
    friendAchievementCount,
  ] = await Promise.all([
    taskModel.find({ userId }).populate("subjectId"),
    taskModel.find({ userId: friendId }).populate("subjectId"),
    subjectModel.find({ userId }),
    subjectModel.find({ userId: friendId }),
    achievementModel.countDocuments({ userId }),
    achievementModel.countDocuments({ userId: friendId }),
  ])

  const buildTaskStats = (tasks) => {
    const cappedHoursSpent = tasks.reduce(
      (sum, task) => sum + Math.min(task.hoursSpent || 0, task.totalHours || 0),
      0,
    )
    const rawHoursSpent = tasks.reduce((sum, task) => sum + (task.hoursSpent || 0), 0)
    const totalHours = tasks.reduce((sum, task) => sum + (task.totalHours || 0), 0)
    const completedGoals = tasks.filter(
      (task) => (task.hoursSpent || 0) >= (task.totalHours || 0) && (task.totalHours || 0) > 0,
    ).length
    const taskProgress = totalHours > 0 ? Math.min(100, (cappedHoursSpent / totalHours) * 100) : null

    return {
      totalHours,
      hoursSpent: rawHoursSpent,
      completedGoals,
      taskProgress,
    }
  }

  const buildWeeklyProgress = (hoursSpent, weeklyStudyHours) => {
    if (!weeklyStudyHours || weeklyStudyHours <= 0) {
      return null
    }

    return Math.min(100, (hoursSpent / weeklyStudyHours) * 100)
  }

  const buildSubjectComparison = (subjects, tasks) => {
    const subjectMap = new Map(subjects.map((subject) => [subject._id.toString(), subject]))

    // Group tasks by subjectId (support multiple tasks per subject)
    const taskGroups = tasks.reduce((map, task) => {
      const key = task.subjectId?._id?.toString?.() || task.subjectId?.toString?.()
      if (!key) return map
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(task)
      return map
    }, new Map())

    const subjectIds = new Set([
      ...subjectMap.keys(),
      ...Array.from(taskGroups.keys()),
    ].filter(Boolean))

    return Array.from(subjectIds).map((subjectId) => {
      const subject = subjectMap.get(subjectId)
      const taskList = taskGroups.get(subjectId) || []

      const totalHours = taskList.reduce((sum, t) => sum + (t.totalHours || 0), 0)
      const hoursSpent = taskList.reduce((sum, t) => sum + (t.hoursSpent || 0), 0)

      return {
        subjectId,
        subjectName: subject?.name || taskList[0]?.name || "Unknown subject",
        hoursPerWeek: subject?.hoursPerWeek || 0,
        totalHours,
        hoursSpent,
      }
    })
  }

  const meStats = buildTaskStats(myTasks)
  const friendStats = buildTaskStats(friendsTasks)
  const meWeeklyProgress = buildWeeklyProgress(meStats.hoursSpent, me.weeklyStudyHours)
  const friendWeeklyProgress = buildWeeklyProgress(friendStats.hoursSpent, friend.weeklyStudyHours)

  res.status(200).json({
    me: {
      _id: me._id,
      fullName: me.fullName,
      profileImage: me.profileImage,
      level: me.level,
      rank: me.rank,
      currentStreak: me.currentStreak,
      achievementCount: myAchievementCount,
      weeklyStudyHours: me.weeklyStudyHours,
      completedGoals: me.completedGoals || 0,
      weeklyGoalProgress: meWeeklyProgress,
      overallProgress: meWeeklyProgress ?? 0,
      ...meStats,
    },
    friend: {
      _id: friend._id,
      fullName: friend.fullName,
      profileImage: friend.profileImage,
      level: friend.level,
      rank: friend.rank,
      currentStreak: friend.currentStreak,
      achievementCount: friendAchievementCount,
      weeklyStudyHours: friend.weeklyStudyHours,
      completedGoals: friend.completedGoals || 0,
      weeklyGoalProgress: friendWeeklyProgress,
      overallProgress: friendWeeklyProgress ?? 0,
      ...friendStats,
    },
    comparison: {
      myTasks,
      friendsTasks,
      subjects: {
        me: buildSubjectComparison(mySubjects, myTasks),
        friend: buildSubjectComparison(friendSubjects, friendsTasks),
      },
    },
  })
})