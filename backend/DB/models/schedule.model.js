import mongoose from "mongoose";
import HttpException from "../../utils/HttpException.js"
const scheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  weekStart: {
    type: Date,
    required: true,
  },

  weekEnd: {
    type: Date,
    required: true, // END OF THE WEEK MUST BE AFTER THE START OF THE WEEK 
  },

  sessions: [
    {
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
      },
      subjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subject'
      },
      startTime: {
        type: Date, // START TIME OF THE TASK MUST BE WITHIN THE THE WEEKSTART AND WEEKEND AND ITS LESS THAN THE END TIME
        required: true,
        validate:{
            validator:function(v){
                return v>=this.parent().weekStart && v<=this.parent().weekEnd && v<this.endTime
            },
            message:"Start Time Must Be Within Week Boundaries"
        }
      },

      endTime: { // MUST BE WITHIN THE WEEKSTART AND WEEKEND AND MORE THAN STARTTIME
        type: Date,
        required: true,
        validate:{
            validator:function(v){
                return v>=this.parent().weekStart && v<=this.parent().weekEnd && v>this.startTime
            },
            message:"End Time Must Between Week Boundaries"
            
        }
      },
      /**
       * Scheduled: Session is planned but hasnt occured yet,
       * Completed: You attended the current session and you finished it,
       * Missed : The 2pm session at monday you missed it.,
       * Rescheduled: Session has been rescheduled
       */
      status: { 
        type: String, 
        enum: ["scheduled", "completed", "missed", "rescheduled"],
        default: "scheduled",
      },
    }
  ],
}, { timestamps: true });

scheduleSchema.index({userId:1,weekStart:1},{unique:true})

scheduleSchema.pre('save', function(next) {
  // Check weekEnd > weekStart
  if (this.weekEnd <= this.weekStart) {
    return next(new HttpException('WeekEnd must be after weekStart',400));
  }

  // Check for overlapping tasks
  if (this.tasks.length > 1) {
    const sorted = [...this.tasks].sort((a, b) => 
      a.startTime.getTime() - b.startTime.getTime()
    );
    /**
     * Prevent Overlapping Tasks EX:
     * Math FROM 10 AM TO 12 AM
     * Science FROM 11AM TO 1AM 
     * We prevent that here
     */
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].endTime > sorted[i + 1].startTime) {
        return next(new HttpException('Tasks cannot overlap',400));
      }
    }
  }
  
  next();
});

const scheduleModel=mongoose.model("Schedule", scheduleSchema);
export default scheduleModel