import mongoose from "mongoose";


const genderTypes = {
    male: "male",
    female: "female",
    other: "other"
};
const languageTypes = {
    English: "English",
    Arabic: "Arabic"
};

const roleTypes = {
    "user": "user",
    "admin": "admin"
};



const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength:3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        lowercase: true
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
        match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    },
    gender: {
        type: String,
        enum:Object.values(genderTypes), // ['male', 'female', 'other']
        default: 'other'
    },
    birthDate: {
        type: Date,
        required: true
    },
    profileImage: {
        type: String, // URI to profile image
        default: null
    },
    bio: {
        type: String,
        default: ''
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastActivityDate: {
        type: Date,
        default: null
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    totalStudyHours: {
        type: Number,
        default: 0
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: {
        sent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        received: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    notificationSettings: { // want to discuss the notification settings
        emailNotification: { type: Boolean, default: true },
        studyReminders: { type: Boolean, default: true },
        weeklyReports: { type: Boolean, default: true },
    },
    preferredLanguage: {
        type: String,
        enum: Object.values(languageTypes), 
        default: 'English'
    },
    weeklyStudyHours: {
        type: Number,
        default: 0
    },
    timer: {
        type: Object
    },
    OTPEmailExpiresAt: {
        type: Date
    },
    OTPPasswordExpiresAt: {
        type: Date
    },
    gpa: {
        type: Number
    },
    isDeleted: {
        type: Boolean,
        default: false
    }, 
    role: {
        type: String,
        enum: Object.values(roleTypes),
        required: true,
        default: roleTypes.user
    },
    changePasswordAt: {
        type: Date
    }, 
    OTPEmail: {
        type: String
    },
    OTPPassword: {
        type: String
    },
    provider: {
        type: String,
        enum: ['system','google'],
        default:'system'
    }

},{
    timestamps: true
});
userSchema.index({email:1,isVerified:1})
const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
