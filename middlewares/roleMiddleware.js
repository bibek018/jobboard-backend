import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const roleMiddleware = (...allowedRoles) => {
  return catchAsync(async (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError("Authentication required", 401));
    }
    const role = req.user.role;
    const isAuthorized = allowedRoles.includes(role);
    if (!isAuthorized) {
      return next(new AppError("Access denied", 403));
    }
    next();
  });
};
