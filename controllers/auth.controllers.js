import { catchAsync } from "../utils/catchAsync.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/Token.js";
import bcrypt from "bcrypt";
export const createAccount = catchAsync(async (req, res, next) => {
  const { name, email, password, phone_no, role } = req.validated.body;
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
    role,
  });
  res.status(201).json({
    success: true,
    message: "Account created successfully",
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
