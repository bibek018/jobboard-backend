import { User } from "../models/User.js";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync.js";

export const requireOnboarded = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if(!user.onboardingComplete){
        return next(new AppError("Kindly submit the onboarding form at first", 403));
    }
    next();
});
