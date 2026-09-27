import { catchAsync } from "../utils/catchAsync.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/Token.js";
import bcrypt from "bcrypt";
export const createAccount = catchAsync(async (req, res, next) => {
  const { name, email, password, phone_no } = req.validated.body;
  const existingUser = await User.findOne({
    $or: [{ email }, { phone_no }],
  });
  if (existingUser) {
    return next(
      new AppError(
        "An account with this email or phone number already exists.",
        409,
      ),
    );
  }
  const user = await User.create({
    name,
    email,
    phone_no,
    password,
    profile: {},
  });
  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user,
  });
});

export const loginAccount = catchAsync(async (req, res, next) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return next(new AppError("Invalid email or password", 401));
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  user.refreshToken = hashedRefreshToken;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Logged in Successfully",
    user,
    accessToken,
  });
});

//Send profile details like role, onboarding completion etc.
export const sendProfile = catchAsync(async (req, res, next) => {
  const userProfile = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: userProfile,
  });
});

export const roleSetUser = catchAsync(async (req, res, next) => {
  const { role } = req.validated.body;
  const user = await User.findById(req.user._id);
  if (user.role) {
    return next(new AppError("Role already set", 400));
  }
  user.role = role;
  await user.save();
  res.status(200).json({
    success: true,
    message: "User role saved successfully",
    user,
  });
});

export const onboardingCandidateHandler = catchAsync(async (req, res, next) => {
  const { preferredLocation, preferredJobType, skills } = req.validated.body;
  const user = await User.findById(req.user._id);
  user.profile = {
    skills,
    preferredLocation,
    preferredJobType,
  };
  const avatar = req.files?.avatar?.[0];
  const resume = req.files?.resume?.[0];
  if (avatar) {
    user.avatarUrl = avatar.path;
    user.avatarPublicId = avatar.filename;
  }
  if (resume) {
    user.profile.resumeUrl = resume.path;
    user.profile.resumePublicId = resume.filename;
  }
  user.onboardingComplete = true;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Onboarding completed successfully. Welcome aboard!",
    user,
  });
});

export const onboardingEmployeeHandler = catchAsync(async (req, res, next) => {
  const { description, industry, companySize, companyName } =
    req.validated.body;
  const user = await User.findOne({ _id: req.user._id });
  user.profile = {
    companyName,
    companySize,
    description,
    industry,
  };
  const avatar = req.files?.avatar?.[0];
  const companyLogo = req.files?.companyLogo?.[0];
  if (avatar) {
    user.avatarUrl = avatar.path;
    user.avatarPublicId = avatar.filename;
  }
  if (companyLogo) {
    user.profile.companyLogo = companyLogo.path;
    user.profile.companyLogo = companyLogo.filename;
  }
  user.onboardingComplete = true;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Onboarding completed successfully. Welcome aboard!",
    user,
  });
});
