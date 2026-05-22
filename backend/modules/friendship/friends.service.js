import HttpException from "../../utils/HttpException.js";
import userModel from "../../DB/models/user.model.js";

export async function checkWhetherUsersExist(userId,senderId){
    try{
          const user = await userModel.findOne({
            _id: userId,
            isDeleted: false,
            isVerified: true
          });
        
          if(!user){
            throw new HttpException("User Doesn't Exist",400)
          }
        
          const friend=await userModel.findOne({
            _id:senderId,
            isDeleted:false,
            isVerified:true
          })
           if(!friend){
            throw new HttpException("Sender Doesn't Exist",400)
          }
        return {user,friend}
    }
    catch(err){
        throw err
    }
}


export const sortLeaderboard = {
  overallProgress: (a, b) => {
    const aWeeklyTarget = a.weeklyStudyHours || 0;
    const bWeeklyTarget = b.weeklyStudyHours || 0;
    const aScore = aWeeklyTarget > 0 ? ((a.currentXP || 0) + (a.hoursSpent || 0)) / aWeeklyTarget : 0;
    const bScore = bWeeklyTarget > 0 ? ((b.currentXP || 0) + (b.hoursSpent || 0)) / bWeeklyTarget : 0;

    return bScore - aScore;
  },

  studyHours: (a, b) => b.hoursSpent - a.hoursSpent,

  level: (a, b) => b.level - a.level,

  weeklyGoal: (a, b) => {
    const aWeeklyTarget = a.weeklyStudyHours || 0;
    const bWeeklyTarget = b.weeklyStudyHours || 0;
    const aProgress = aWeeklyTarget > 0 ? ((a.currentXP || 0) + (a.hoursSpent || 0)) / aWeeklyTarget : 0;
    const bProgress = bWeeklyTarget > 0 ? ((b.currentXP || 0) + (b.hoursSpent || 0)) / bWeeklyTarget : 0;

    return bProgress - aProgress;
  },
};