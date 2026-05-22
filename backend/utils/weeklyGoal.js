import sessionModel from "../DB/models/session.model.js";
import userModel from "../DB/models/user.model.js";
import { startOfWeek, endOfWeek } from "date-fns";

export async function incrementWeeklyGoalIfNeeded(userId) {
  if (!userId) return false;

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const sessions = await sessionModel.find({
    userId,
    status: "completed",
    startTime: { $gte: weekStart, $lte: weekEnd },
  }).select("totalDuration");

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0);
  const totalHours = totalMinutes / 60;

  const user = await userModel.findById(userId).select("weeklyStudyHours weeklyGoalHours completedGoals lastCompletedGoalWeekStart");
  if (!user) return false;

  const target = Number(user.weeklyStudyHours || user.weeklyGoalHours || 0);
  if (!target || target <= 0) return false;

  const alreadyCounted = user.lastCompletedGoalWeekStart && new Date(user.lastCompletedGoalWeekStart) >= weekStart;

  if (totalHours >= target && !alreadyCounted) {
    user.completedGoals = (user.completedGoals || 0) + 1;
    user.lastCompletedGoalWeekStart = weekStart;
    await user.save();
    return true;
  }

  return false;
}

export default incrementWeeklyGoalIfNeeded;
