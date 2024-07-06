const mongoose = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");
const { challengeStatus, userChallengeStatus } = require("../enums/index");

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

const userChallengeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    target: {
      type: Number,
    },
    progress: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: userChallengeStatus,
      default: userChallengeStatus.Inprogress,
    },
  },
  { timestamps: true }
);

userChallengeSchema.plugin(mongoosePaginate);
const UserChallenge = mongoose.model("UserChallenge", userChallengeSchema);

module.exports = UserChallenge;
