import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const requireRoleSet = catchAsync(async (req, res, next) => {
  const role = req.user.role;
  if (role !== null || !role) {
    return next(new AppError("Kindly select user's role at first", 403));
  }
  next();
});
