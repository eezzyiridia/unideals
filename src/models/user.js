const mongoose = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");
const { userStatus, roles } = require("../enums/index");

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

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    nationality: {
      type: String,
    },
    confirmationCode: Number,
    email: {
      type: String,
      Required: true,
      match: [
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        "Please enter a valid email address",
      ],
      unique: true,
    },
    password: {
      type: String,
      Required: true,
      select: false,
    },
    role: {
      type: String,
      enum: roles,
      default: roles.User,
    },
    status: {
      type: String,
      enum: userStatus,
      default: userStatus.Active,
    },

    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);
const User = mongoose.model("User", userSchema);

module.exports = User;
