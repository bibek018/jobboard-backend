import { Application } from "../models/Application.js";
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

export const getJobsForPublic = catchAsync(async (req, res, next) => {
  const { page, limit, location, type, keyword, sort, order } =
    req.validated.query;

  const filter = {
    status: "Open",
  };

  if (location) {
    filter.location = {
      $regex: location,
      $options: "i",
    };
  }

  if (type) {
    filter.type = type;
  }

  if (keyword) {
    filter.$or = [
      {
        title: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        description: {
          $regex: keyword,
          $options: "i",
        },
      },
    ];
  }

  const sortOrder = order === "desc" ? -1 : 1;

  const skip = (page - 1) * limit;

  const [jobs, totalJobs] = await Promise.all([
    Job.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sort]: sortOrder }),
    Job.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Jobs fetched successfully",
    jobs,
    pagination: {
      page,
      limit,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
    },
  });
});

export const applyJob = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Resume is required", 400));
  }
  const { jobId } = req.validated.body;
  const existingApplication = await Application.findOne({
    jobId,
    candidateId: req.user._id,
  });
  if (existingApplication) {
    return next(
      new AppError("You have already applied for this position.", 409),
    );
  }

  const application = await Application.create({
    jobId,
    candidateId: req.user._id,
    resumeUrl: req.file.path,
    resumePublicId: req.file.filename,
  });
  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    application,
  });
});

export const getMyApplications = catchAsync(async (req, res, next) => {
  const applications = await Application.find({
    candidateId: req.user._id,
  }).populate("jobId", "title company location salary type");
  res.status(200).json({
    succces: true,
    message: "Application fetched successfully",
    applications,
  });
});

export const getJobApplicants = catchAsync(async (req, res, next) => {
  const jobId = req.params.id;
  if (!jobId) {
    return next(new AppError("Job Id not provided", 400));
  }
  const isJobCreator = await Job.findOne({
    _id: jobId,
    postedBy: req.user._id,
  });
  if (!isJobCreator) {
    return next(new AppError("Access Denied", 403));
  }
  const applicants = await Application.find({ jobId }).populate(
    "candidateId",
    "name email",
  );
  res.status(200).json({
    success: true,
    message: "Applicants fetched successfully",
    applicants,
  });
});

export const changeApplicationStatus = catchAsync(async (req, res, next) => {
  const applicationId = req.params.id;
  if (!applicationId) {
    return next(new AppError("Application id not provided", 400));
  }
  const { status } = req.validated.body;
  const application = await Application.findOne({
    _id: applicationId,
  }).populate("candidateId", "name email");
  const job = await Job.findOne({ _id: application.jobId });
  if (job.postedBy !== req.user_id) {
    return next(new AppError("Access Denied", 403));
  }
  application.status = status;
  await application.save();
  res.status(200).json({
    success: true,
    message: "Application status updated successfully",
    application,
  });
});
