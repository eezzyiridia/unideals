const Challenge = require("../models/challenge");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const fs = require("fs");
const {
  challengeSchema,
  achievementSchema,
  badgetSchema,
} = require("../validation/gamify");
const {
  userStatus,
  challengeStatus,
  userChallengeStatus,
  challengeType,
} = require("../enums");
const UserChallenge = require("../models/userChallenge");
const Leader = require("../models/leader");
const io = require("../../app");
const Product = require("../models/product");
const Badge = require("../models/badge");
const Achievement = require("../models/achievement");
const UserAchievement = require("../models/userAchievement");

const createChallenge = asyncHandler(async (req, res, next) => {
  const { error } = challengeSchema.validate(req.body);

  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const challenge = await Challenge.create(req.body);

  res.status(201).json({
    success: true,
    msg: "successfully created a challenge",
    data: challenge,
  });
});

const createProduct = asyncHandler(async (req, res, next) => {
  // const { error } = challengeSchema.validate(req.body);

  // if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    msg: "successfully created a product",
    data: product,
  });
});

const createBadge = asyncHandler(async (req, res, next) => {
  const { error } = badgetSchema.validate(req.body);

  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const badge = await Badge.create(req.body);

  res.status(201).json({
    success: true,
    msg: "successfully created a Badge",
    data: badge,
  });
});

const createAchievement = asyncHandler(async (req, res, next) => {
  const { error } = achievementSchema.validate(req.body);

  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const badge = await Badge.findById(req.body.badge);

  if (!badge) return next(new ErrorResponse(`This badge does not exist`, 404));

  const achievement = await Achievement.create(req.body);

  res.status(201).json({
    success: true,
    msg: "successfully created an achievement",
    data: achievement,
  });
});

const getChallenges = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = {
    status: challengeStatus.Active,
  };
  if (search) {
    query.description = {
      $regex: search,
      $options: "i",
    };
  }
  const challenges = await Challenge.paginate(query, {
    page,
    limit,
    sort: { createdAt: -1 },
  });

  res.status(201).json({
    success: true,
    msg: "successfully retreived all challenges",
    data: challenges,
  });
});

const userChallenge = asyncHandler(async (req, res, next) => {
  const user = req.user.userId;

  const { challengeId, productId } = req.params;

  const challenge = await Challenge.findById(challengeId);

  if (!challenge)
    return next(new ErrorResponse(`This challenge does not exist`, 404));

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorResponse(`Product not found`, 404)); // New check

  let userChallenge = await UserChallenge.findOne({
    user,
    challenge: challengeId,
  });

  if (userChallenge && userChallenge.status == userChallengeStatus.Completed)
    return next(new ErrorResponse(`You have completed this challenge`, 400));

  if (!userChallenge) {
    userChallenge = await UserChallenge.create({
      user,
      challenge: challengeId,
      target: challenge.target,
    });
  }

  if (challenge.type == challengeType.Like) {
    product.like++;
  }
  if (challenge.type == challengeType.Comment) {
    product.comment.push(req.body.comment);
  }

  userChallenge.progress += 1;
  userChallenge.status =
    userChallenge.progress == challenge.target
      ? userChallengeStatus.Completed
      : userChallengeStatus.Inprogress;

  if (userChallenge.status == userChallengeStatus.Completed) {
    let leader = await Leader.findOne({ user });
    if (leader) {
      leader.points += challenge.points;
      await leader.save();
    } else {
      leader = await Leader.create({ user, points: challenge.points });
    }
    userChallenge.points = challenge.points;
    const leaders = await Leader.find({})
      .sort({ points: -1 })
      .limit(10)
      .populate({ path: "user", select: "fullName email" });

    global.io.emit("leaderboardUpdate", {
      leaders,
    });
  }
  const [savedProduct, savedUserChallenge] = await Promise.all([
    product.save(),
    userChallenge.save(),
  ]);
  res.status(201).json({
    success: true,
    msg: "successfully created a user challenge",
    data: savedUserChallenge,
  });
});

const getUserAchievements = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const query = {
    user: req.user.userId,
  };

  const userAchievements = await UserAchievement.paginate(query, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: {
      path: "achievement",
      populate: { path: "badge", select: "-createdAt -updatedAt" },
      select: "-createdAt -updatedAt",
    },
  });

  res.status(201).json({
    success: true,
    msg: "successfully retreived all user achievement",
    data: userAchievements,
  });
});

module.exports = {
  createChallenge,
  getChallenges,
  userChallenge,
  createProduct,
  createAchievement,
  createBadge,
  getUserAchievements,
};
