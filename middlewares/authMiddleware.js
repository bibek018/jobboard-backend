import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
export const authMiddleware = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authentication is required", 401));
  }
  const accessToken = authHeader.split(" ")[1];
  const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET);
  req.user = payload;
  logger.info("User has been set");
  next();
});
