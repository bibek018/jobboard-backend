import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { User } from "../models/User.js";

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
    user.profile.companyLogoID = companyLogo.filename;
  }
  user.onboardingComplete = true;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Onboarding completed successfully. Welcome aboard!",
    user,
  });
});
