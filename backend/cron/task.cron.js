import cron from 'node-cron'
import taskModel from '../DB/models/task.model'


export const checkDueTasks=()=>{
  cron.schedule("* * * * *", async () => {
  try {
    const today = new Date();

    const result = await taskModel.deleteMany({
      dueDate: { $lt: today }
    });

    console.log(`${result.deletedCount} overdue tasks deleted.`);
  } catch (err) {
    console.log(err);
  }
});
    
}