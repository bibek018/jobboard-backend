import { Job } from "../models/Job.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
export const createJob = catchAsync(async (req, res, next) => {
  const { title, description, location, salary, type } = req.validated.body;
  const job = await Job.create({
    title,
    description,
    location,
    salary,
    type,
    postedBy: req.user._id,
  });
  res.status(201).json({
    success: true,
    message: "Job created successfully",
    job,
  });
});

export const publishOrCloseJob = catchAsync(async (req, res, next) => {
  const { status } = req.validated.body;
  const jobId = req.params.id;
  const job = await Job.findOne({ _id: jobId, postedBy: req.user._id });
  if (!job) {
    return next(new AppError("Job does not exists", 404));
  }
  job.status = status;
  await job.save();
  res.status(200).json({
    success: true,
    message: "Job updated successfully",
    job,
  });
});

export const getMyJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    message: "Jobs fetched successfully",
    jobs,
  });
});

export const deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findOneAndDelete({
    _id: req.params.id,
    postedBy: req.user._id,
  });
  if (!job) {
    return next(new AppError("Job does not exists"));
  }
  res.sendStatus(204);
});
