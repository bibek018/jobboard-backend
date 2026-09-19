import { catchAsync } from "../utils/catchAsync.js";
import { User } from "../models/User.js";
export const createAccount = catchAsync(async (req, res, next) => {
  const { name, email, password, phone_no } = req.validated.body;
  const existingUser1 = await User.findOne({ email });
  if (existingUser1) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }
  const existingUser2 = await User.findOne({ phone_no });
  if (existingUser1) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }
  const user = await User.create({
    name,
    email,
    phone_no,
    password,
  });
  res.status(201).json({
    success: true,
    message: "Account created successfully",
  });
});
