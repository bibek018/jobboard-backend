import { catchAsync } from "../utils/catchAsync.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/Token.js";
import bcrypt from "bcrypt";
import { cookies } from "supertest";
import { success } from "zod";
import { referrerPolicy } from "helmet";
import jwt from "jsonwebtoken";

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

export const handleRefresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new AppError("User not Authenticated", 401));
  }
  const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  const user = await User.findById(payload._id).select("+refreshToken");
  if (!user) {
    return next(new AppError("User does not exits. Please login again", 401));
  }
  const isVerified = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isVerified) {
    return next(new AppError("Token does not match", 401));
  }
  const newRefreshToken = generateRefreshToken(user);
  const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
  const accessToken = generateAccessToken(user);
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  user.refreshToken = newHashedRefreshToken;
  await user.save();
  res.status(200).json({
    success: true,
    user,
    accessToken,
  });
});

export const googleAuthHandler = catchAsync(async (req, res, next) => {
  if (!req?.user?.email) {
    return next(new AppError("Google authentication failed", 400));
  }

  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isProduction = process.env.NODE_ENV === "production";
  const refreshToken = await generateRefreshToken(user);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.redirect(`${process.env.CLIENT_ORIGIN}/dashboard`);
});

export const facebookAuthHandler = catchAsync(async (req, res, next) => {
  if (!req?.user?.email) {
    return next(new AppError("Facebook authentication failed", 400));
  }

  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isProduction = process.env.NODE_ENV === "production";
  const refreshToken = await generateRefreshToken(user);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.redirect(`${process.env.CLIENT_ORIGIN}/dashboard`);
});

export const githubAuthHandler = catchAsync(async (req, res, next) => {
  if (!req?.user?.email) {
    return next(new AppError("GitHub authentication failed", 400));
  }

  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isProduction = process.env.NODE_ENV === "production";
  const refreshToken = await generateRefreshToken(user);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.redirect(`${process.env.CLIENT_ORIGIN}/dashboard`);
});

export const linkedInAuthHandler = catchAsync(async (req, res, next) => {
  if (!req?.user?.email) {
    return next(new AppError("LinkedIn authentication failed", 400));
  }

  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isProduction = process.env.NODE_ENV === "production";
  const refreshToken = await generateRefreshToken(user);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.redirect(`${process.env.CLIENT_ORIGIN}/dashboard`);
});
