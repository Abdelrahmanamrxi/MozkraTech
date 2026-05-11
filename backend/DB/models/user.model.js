import mongoose from "mongoose";

const genderTypes = {
  male: "male",
  female: "female",
  other: "other",
};
const languageTypes = {
  English: "English",
  Arabic: "Arabic",
};

export const roleTypes = {
  user: "user",
  admin: "admin",
};

const timeHHmm = /^([01]\d|2[0-3]):([0-5]\d)$/;
const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    summary: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (v) {
          // If value is provided and not empty, it must be at least 30 chars
          if (v && v.length > 0) {
            return v.length >= 30;
          }
          return true; // Empty strings are allowed
        },
        message: "Summary must be at least 30 characters long if provided",
      },
    },
    bio: {
      type: String,
      trim: true,
      minLength: 100,
    },
    plan: {
      name: {
        type: String,
        default: "free",
        enum: ["free", "premium", "pro"],
      },
      limits: {
        aiScheduleLimit: {
          type: Number,
          default: 0,
        },
        aiChatLimit: {
          type: Number,
          default: 0,
        },
        docLimit: {
          type: Number,
          default: 0,
        },
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      lowercase: true,
    },
    location: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == "google" ? false : true;
      },
      minlength: 8,
      trim: true,
      match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    },
    gender: {
      type: String,
      enum: Object.values(genderTypes), // ['male', 'female', 'other']
      default: "other",
    },
    birthDate: {
      type: Date,
      required: true,
    },
    profileImage: {
      type: String, // URI to profile image
      default: null,
    },
    bio: {
      type: String,
      default: "",
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    currentXP: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
      default: null,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    totalStudyHours: {
      type: Number,
      default: 0,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: {
      sent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      received: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    notificationSettings: {
      // want to discuss the notification settings
      emailNotifications: { type: Boolean, default: true },
      studyReminders: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true },
    },
    weeklyStudyHours: {
      type: Number,
      default: 0,
    },
    preferredTime: {
      type: String,
      enum: ["morning", "afternoon", "evening", "night"],
      default: "morning",
    },
    preferredTimeRange: {
      start: {
        type: String,
        default: "08:00",
        match: timeHHmm,
      },
      end: {
        type: String,
        default: "22:00",
        match: timeHHmm,
      },
    },
    freeDays: {
      type: [String],
      enum: weekDays,
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    weeklyGoalHours: {
      type: Number,
      default: 25,
      min: 1,
    },
    timer: {
      sessionDuration: {
        type: Number,
        default: 60,
        min: 1,
      },
      breakDuration: {
        type: Number,
        default: 15,
        min: 1,
      },
    },
    isSubjectVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    OTPEmailExpiresAt: {
      type: Date,
    },
    OTPPasswordExpiresAt: {
      type: Date,
    },
    gpa: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(roleTypes),
      required: true,
      default: roleTypes.user,
    },
    changePasswordAt: {
      type: Date,
    },
    OTPEmail: {
      type: String,
    },
    OTPPassword: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["system", "google"],
      default: "system",
    },
    viewers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        time: [Date],
      },
    ],
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  },
  {
    timestamps: true,
  },
);
userSchema.index({ email: 1, isVerified: 1 });
userSchema.index({ name: 1 });
userSchema.index({ _id: 1, isVerified: 1, isDeleted: 1 });

userSchema.methods.addXP = async function (amount) {
  this.currentXP = (this.currentXP || 0) + amount;
  const newLevel = Math.floor(Math.sqrt(this.currentXP / 100)) + 1;
  let oldLevel;
  if (newLevel > this.level) {
    oldLevel = this.level;
    this.level = newLevel;
  }
  return {
    user: await this.save(),
    leveledUp: newLevel > oldLevel,
    newLevel,
  };
};

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
