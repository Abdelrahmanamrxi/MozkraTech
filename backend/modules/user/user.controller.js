import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import HttpException from "../../utils/HttpException.js";
import friendshipModel from "../../DB/models/friendship.model.js";
import { notificationModel } from "../../DB/models/notifications.model.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { profileImageConfig } from "../../middleware/upload.js";
import subjectModel from "../../DB/models/subject.model.js";
import taskModel from "../../DB/models/task.model.js";
import achievementModel from "../../DB/models/achievement.model.js";

const getRelativeImagePath = (imageUrl) => {
  if (!imageUrl) return "";
  try {
    const parsed = new URL(imageUrl);
    return parsed.pathname || "";
  } catch (error) {
    return imageUrl;
  }
};

const resolveProfileImagePath = (imageUrl) => {
  const relativePath = getRelativeImagePath(imageUrl);
  if (!relativePath.startsWith(profileImageConfig.publicPrefix)) return "";

  const safeRelative = relativePath.replace(/^[/\\]+/, "");
  const absolutePath = path.resolve(process.cwd(), safeRelative);
  const uploadsRoot = path.resolve(process.cwd(), "uploads", "profile");

  if (!absolutePath.startsWith(uploadsRoot)) return "";
  return absolutePath;
};

const removeProfileImageFile = (imageUrl) => {
  const filePath = resolveProfileImagePath(imageUrl);
  if (!filePath) return;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
// ----------------------------------updateProfile-------------------------------------------
export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = req.user._id;

  const updatedUser = await userModel.updateOne({ _id: user }, req.body);
  return res
    .status(200)
    .json({ message: "updateProfile success", updatedUser });
});

// ----------------------------------updateProfileImage-------------------------------------------
export const updateProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new HttpException("Profile image file is required", 400));
  }

  const userId = req.user._id;
  const user = await userModel.findOne({ _id: userId, isDeleted: false });

  if (!user) {
    return next(new HttpException("User Not Found", 404));
  }

  const previousImage = user.profileImage;
  const nextImage = `${profileImageConfig.publicPrefix}/${req.file.filename}`;

  user.profileImage = nextImage;
  await user.save();

  if (previousImage && previousImage !== nextImage) {
    removeProfileImageFile(previousImage);
  }

  return res.status(200).json({
    message: "Profile image updated successfully",
    profileImage: nextImage,
  });
});

// ----------------------------------removeProfileImage-------------------------------------------
export const removeProfileImage = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findOne({ _id: userId, isDeleted: false });

  if (!user) {
    return next(new HttpException("User Not Found", 404));
  }

  const previousImage = user.profileImage;
  user.profileImage = null;
  await user.save();

  if (previousImage) {
    removeProfileImageFile(previousImage);
  }

  return res.status(200).json({
    message: "Profile image removed successfully",
    profileImage: null,
  });
});

// ----------------------------------updateStudyPreferences-------------------------------------------
export const updateStudyPreferences = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const {
    sessionDuration,
    breakDuration,
    preferredTime,
    preferredTimeRange,
    freeDays,
    weeklyGoalHours,
    weeklyStudyHours,
  } = req.body;

  const update = {};
  if (sessionDuration !== undefined)
    update["timer.sessionDuration"] = sessionDuration;
  if (breakDuration !== undefined)
    update["timer.breakDuration"] = breakDuration;
  if (preferredTime !== undefined) update.preferredTime = preferredTime;
  if (preferredTimeRange?.start !== undefined)
    update["preferredTimeRange.start"] = preferredTimeRange.start;
  if (preferredTimeRange?.end !== undefined)
    update["preferredTimeRange.end"] = preferredTimeRange.end;
  if (freeDays !== undefined) update.freeDays = [...new Set(freeDays)];
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

// ----------------------------------changePassword-------------------------------------------
export const changePassword = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  const user = await userModel.findOne({ _id: userId, isDeleted: false });
  if (!user) {
    return next(new HttpException("User Not Found", 404));
  }

  if (user.provider !== "system") {
    return next(
      new HttpException("Password change not available for this account", 400),
    );
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return next(new HttpException("Current password is incorrect", 400));
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    +process.env.SALT_ROUNDS,
  );
  user.password = hashedPassword;
  user.changePasswordAt = new Date();
  await user.save();

  return res.status(200).json({
    message: "Password changed successfully",
  });
});

// ----------------------------------deleteAccount-------------------------------------------
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await userModel.findOne({ _id: userId, isDeleted: false });
  if (!user) {
    return next(new HttpException("User Not Found", 404));
  }

  user.isDeleted = true;
  user.isVerified = false;
  await user.save();

  res.clearCookie("refreshToken", {
    sameSite: "strict",
    httpOnly: true,
  });

  return res.status(200).json({
    message: "Account deleted successfully",
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
      "level fullName currentXP currentStreak createdAt bio summary subjects viewers profileImage",
    )
    .populate("subjects", "name");

  if (!user) {
    return next(
      new HttpException("User Not Found or Deleted or Not Verified", 404),
    );
  }
  const achievements=await achievementModel.find({userId:user._id})

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
      profileImage:user.profileImage,
      achievements
    };
  } else if (isPending) {
    safeUser = {
      fullName: user.fullName,
      bio: user.bio,
      summary: user.summary,
      createdAt: user.createdAt,
      subjects: [],
      profileImage:user.profileImage
    };
  } else {
    safeUser = {
      fullName: user.fullName,
      createdAt: user.createdAt,
      bio: "Hidden",
      summary: "Hidden",
      subjects: [],
      profileImage:user.profileImage
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

  const [tasks, subjectCount, achievementCount] = await Promise.all([
    taskModel.find({ userId: user._id }),
    subjectModel.countDocuments({ userId: user._id }),
    achievementModel.countDocuments({ userId: user._id }),
  ]);
  

  const studyHours = tasks.reduce((sum, t) => sum + (t.hoursSpent || 0), 0);

  const isEdit = req.query?.edit === "true" || req.query?.edit === "1";

  const baseResponse = {
    message: "getProfile success",
    user,
    metrics: {
      subjectCount,
      achievementCount,
      studyHours,
      streak: user.streak,
    },
  };

  if (!isEdit) return res.status(200).json(baseResponse);

  // When edit mode is requested, include subjects and study preferences
  const subjects = await subjectModel
    .find({ userId: user._id })
    .select("name difficulty interestLevel subjectType hoursPerWeek")
    .sort({ createdAt: -1 });

  const preferences = {
    timer: user.timer || {},
    preferredTimeRange: user.preferredTimeRange || {},
    freeDays: user.freeDays || [],
    weeklyStudyHours: user.weeklyStudyHours,
    weeklyGoalHours: user.weeklyGoalHours,
  };

  return res.status(200).json({
    ...baseResponse,
    data: {
      subjects,
      preferences,
    },
  });
});