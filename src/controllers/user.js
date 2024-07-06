const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const fs = require("fs");
const { generateOTP } = require("../utils/generateCode");
const ejs = require("ejs");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const sendMail = require("../utils/sendMails");
const {
  registrationSchema,
  confirmationSchema,
  loginSchema,
} = require("../validation/user");
const { userStatus } = require("../enums");

const registerUser = asyncHandler(async (req, res, next) => {
  const { error } = registrationSchema.validate(req.body);

  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const { email, password: plainPassword } = req.body;

  // check if email exist
  const userExist = await User.findOne({ email });
  if (userExist)
    return next(new ErrorResponse(`${email} has already been used`, 400));

  const confirmationCode = generateOTP(6);

  // hash password
  const password = await hashPassword(plainPassword, 12);

  req.body.password = password;
  req.body.confirmationCode = confirmationCode;

  const user = await User.create(req.body);

  if (!user) return next(new ErrorResponse(`user could not be created`, 500));

  const userObj = user.toObject();

  delete userObj.password;

  const template = fs.readFileSync("templates/welcome.ejs", "utf8");

  const words = {
    name: user.fullName,
    code: user.confirmationCode,
  };

  const message = ejs.render(template, words);

  // send code to user
  try {
    await sendMail({
      email: user.email,
      subject: "Confirmation Code",
      message,
    });
  } catch (error) {
    console.log(error.message);
    next(new ErrorResponse("message could not be sent", 500));
  }

  res
    .status(201)
    .json({
      success: true,
      msg: "successfully registered a user",
      data: userObj,
    });
});

const confirmEmail = asyncHandler(async (req, res, next) => {
  const { error } = confirmationSchema.validate(req.body);

  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const { confirmationCode } = req.body;

  const user = await User.findOne({ confirmationCode });

  if (!user) {
    return next(new ErrorResponse("Invalid code", 404));
  }

  if (user.isConfirmed) {
    return next(new ErrorResponse("User email already confirmed", 400));
  }

  user.isConfirmed = true;

  user.confirmationCode = undefined;

  await user.save();

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role:  user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  res
    .status(200)
    .json({
      success: true,
      msg: "Email successfully confirmed",
      data: { user, token },
    });
});

const login = asyncHandler(async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const { password, email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 404));
  }

  const isValidPassword = await comparePassword(password, user.password);


  if (!isValidPassword) {
    return next(new ErrorResponse("invalid credentials", 400));
  }

  if (!user.isConfirmed) {
    return next(new ErrorResponse("Please confirm your email", 400));
  }

  // if user is no more employed throw error
  if (user.status !== userStatus.Active) {
    return next(new ErrorResponse("Please contact admin", 400));
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  res
    .status(200)
    .json({
      success: true,
      msg: "User Successfully logged in",
      data: { token },
    });
});

module.exports = { registerUser, confirmEmail, login };
