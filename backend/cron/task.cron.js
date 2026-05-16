import cron from 'node-cron'
import taskModel from '../DB/models/task.model.js'
import sessionModel from '../DB/models/session.model.js';


export const deleteDueTasks=()=>{
  cron.schedule("*/10 * * * *", async () => {
  try {
    const today = new Date();
    const tasks = await taskModel.find({ dueDate: { $lt: today } }).select('_id');
    const taskIds = tasks.map(task => task._id);

    if(taskIds.length===0) return;

    await sessionModel.deleteMany({taskId:{$in:taskIds}})

    const deletedTasks=await taskModel.deleteMany({_id:{$in:taskIds}})

    console.log(`${deletedTasks.length} has been deleted`)
    
  } catch (err) {
    console.log(err);
  }
});   
}