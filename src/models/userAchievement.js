const mongoose = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");


mongoosePaginate.paginate.options = {
    limit: 20,
    useEstimatedCount: false,
    customLabels: {
      totalDocs: "totalDocs",
      docs: "docs",
      limit: "perPage",
      page: "currentPage",
      nextPage: "nextPage",
      prevPage: "prevPage",
      totalPages: "totalPages",
      pagingCounter: "serialNo",
      meta: "pagination",
    },
  };
  
  const userAchievementSchema = new mongoose.Schema(
    {
        
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
          },
          achievement: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Achievement', 
          },
           
      
    },
    { timestamps: true }
  );

  userAchievementSchema.plugin(mongoosePaginate);
const UserAchievement = mongoose.model("UserAchievement", userAchievementSchema);

module.exports = UserAchievement;