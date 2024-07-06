const cron = require("node-cron");
const Achievement = require("../models/achievement");
const Leader = require("../models/leader");
const UserAchievement = require("../models/userAchievement");

const task1 = cron.schedule("* * * * *", async (req, res) => {
  console.log("task is running");
  const achievements = await Achievement.find({});
  const leader = await Leader.find({});
  if (achievements.length > 0 && leader.length > 0) {
    for (let i = 0; i < achievements.length; i++) {
      for (let j = 0; j < leader.length; j++) {
        if (leader[j].points >= achievements[i].points) {
          const userAchievement = await UserAchievement.findOne({
            achievement: achievements[i]._id,
            user: leader[j].user,
          });
          if (!userAchievement) {
            await UserAchievement.create({
              user: leader[j].user,
              achievement: achievements[i]._id,
            });
            console.log("task ran");
          }
        }
      }
    }
  }
});

module.exports = { task1 };
