import cron from 'node-cron'
import sessionModel from '../DB/models/session.model.js'



export const updateMissedSessions = () => {

  cron.schedule("*/5 * * * *", async () => {

    try {

      const now = new Date();

      const session = await sessionModel.updateMany(
        {
          endTime: { $lt: now },

          status: "scheduled"
        },

        {
          $set: {
            status: "missed"
          }
        }
      );

      console.log(
        `${session.modifiedCount} sessions marked missed`
      );

    } catch (err) {

      console.log(err);

    }

  });

};

