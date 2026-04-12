import SubjectModel from "../../DB/models/subject.model.js";
import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import HttpException from "../../utils/HttpException.js";

export const createSubject = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { name, difficulty, interestLevel, subjectType } = req.body;

  const subject = await SubjectModel.create({
    name,
    difficulty,
    interestLevel,
    subjectType,
    user: userId,
  });

  await userModel.findByIdAndUpdate(userId, {
    $addToSet: { subjects: subject._id },
  });

  return res
    .status(201)
    .json({ message: "Subject created successfully", subject });
});
