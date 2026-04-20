import SubjectModel from "../../DB/models/subject.model.js";
import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import HttpException from "../../utils/HttpException.js";

export const createSubject = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { name, difficulty, interestLevel, subjectType, hoursPerWeek } =
    req.body;

  const subject = await SubjectModel.create({
    name,
    difficulty,
    interestLevel,
    subjectType,
    hoursPerWeek,
    user: userId,
  });

  await userModel.findByIdAndUpdate(userId, {
    $addToSet: { subjects: subject._id },
  });

  return res
    .status(201)
    .json({ message: "Subject created successfully", subject });
});

export const getUserSubjects = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const subjects = await SubjectModel.find({ user: userId }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json({ message: "Subjects loaded successfully", subjects });
});

export const deleteSubject = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { subjectId } = req.params;

  const subject = await SubjectModel.findOneAndDelete({
    _id: subjectId,
    user: userId,
  });

  if (!subject) {
    return next(new HttpException("Subject not found", 404));
  }

  await userModel.findByIdAndUpdate(userId, {
    $pull: { subjects: subject._id },
  });

  return res.status(200).json({
    message: "Subject deleted successfully",
    subjectId: subject._id,
  });
});
