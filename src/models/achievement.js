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

const achievementSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    points: {
      type: Number,
    },
    description: {
      type: String,
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
    },
  },
  { timestamps: true }
);

achievementSchema.plugin(mongoosePaginate);
const Achievement = mongoose.model("Achievement", achievementSchema);

module.exports = Achievement;
