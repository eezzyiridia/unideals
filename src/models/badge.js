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

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    description: {
      type: String,
    },

    icon: {
      type: String,
    },
  },
  { timestamps: true }
);

badgeSchema.plugin(mongoosePaginate);
const Badge = mongoose.model("Badge", badgeSchema);

module.exports = Badge;
