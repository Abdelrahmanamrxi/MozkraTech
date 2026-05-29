import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    correctAnswerIndex: {
      type: Number,
      default: null,
    },
    explanation: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false },
);

const userAnswerSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    selectedAnswer: {
      type: Number,
      default: null,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizTitle: {
      type: String,
      required: true,
      trim: true,
    },
    questionType: {
      type: String,
      enum: ["MCQ", "True_False", "Mixed"],
      required: true,
    },
    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    numberOfQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    questions: {
      type: [questionSchema],
      required: true,
      default: [],
    },
    userAnswers: {
      type: [userAnswerSchema],
      default: [],
    },
    score: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

quizSchema.index({ userId: 1, createdAt: -1 });

const quizModel = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default quizModel;
