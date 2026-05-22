import cron from 'node-cron'
import userModel from '../DB/models/user.model.js'

export const weeklyResetCompletedGoals = () => {
  // Runs at 00:05 every Monday
  cron.schedule('5 0 * * 1', async () => {
    try {
      const res = await userModel.updateMany({}, { $set: { completedGoals: 0 }, $unset: { lastCompletedGoalWeekStart: "" } });
      console.log(`Weekly reset: ${res.modifiedCount} users reset completedGoals`);
    } catch (err) {
      console.log('Weekly reset failed', err);
    }
  });
};

export default weeklyResetCompletedGoals;
