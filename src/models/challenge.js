const mongoose = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");
const { challengeStatus, challengeType } = require("../enums/index");

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

const challengeSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: challengeType,
    },
    target: {
      type: Number,
    },
    points: {
      type: Number,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: challengeStatus,
      default: challengeStatus.Active,
    },
  },
  { timestamps: true }
);

challengeSchema.plugin(mongoosePaginate);
const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
