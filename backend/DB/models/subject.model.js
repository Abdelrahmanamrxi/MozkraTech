import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      trim: true,
    },
    interestLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    subjectType: {
      type: String,
      required: true,
      enum: ["theoretical", "practical"],
    },
    hoursPerWeek: {
      type: Number,
      required: true,
      min: 1,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

subjectSchema.index({userId:1})

const subjectModel =
  mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
export default subjectModel;
