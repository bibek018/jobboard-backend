import express from "express";

import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validate.js";

import {
  createJob,
  publishOrCloseJob,
  getMyJobs,
  deleteDraftedJob,
  getJobsForPublic,
  applyJob,
  getMyApplications,
  getJobApplicants,
  changeApplicationStatus,
} from "../controllers/jobs.controllers.js";

import {
  jobCreateSchema,
  jobPublishOrCloseSchema,
  getJobSchema,
  jobApplySchema,
  applicationStatusChangeSchema,
  myJobsSchema,
  getMyApplicationsSchema,
  getApplicantsSchema,
} from "../validators/jobs.validator.js";

import { upload } from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireOnboarded } from "../middlewares/requireOnboarded.js";

const router = express.Router();

// Public
router.get("/v1", validate(getJobSchema, "query"), getJobsForPublic);

// Protected
router.use(authMiddleware);
router.use(requireOnboarded);
// Employer — Jobs
router.post(
  "/v1/",
  roleMiddleware("employer"),
  validate(jobCreateSchema),
  createJob,
);

router.patch(
  "/v1/:id",
  roleMiddleware("employer"),
  validate(jobPublishOrCloseSchema),
  publishOrCloseJob,
);

router.get(
  "/v1/my-jobs",
  roleMiddleware("employer"),
  validate(myJobsSchema, "query"),
  getMyJobs,
);

router.delete("/v1/:id", roleMiddleware("employer"), deleteDraftedJob);

// Candidate — Applications
router.post(
  "/v1/:id/apply",
  roleMiddleware("candidate"),
  upload.single("resume"),
  validate(jobApplySchema),
  applyJob,
);

router.get(
  "/v1/applications/my-applications",
  roleMiddleware("candidate"),
  validate(getMyApplicationsSchema, "query"),
  getMyApplications,
);

// Employer — Applicants
router.get(
  "/v1/:id/applicants",
  roleMiddleware("employer"),
  validate(getApplicantsSchema, "query"),
  getJobApplicants,
);

router.patch(
  "/v1/applications/:id/status",
  roleMiddleware("employer"),
  validate(applicationStatusChangeSchema),
  changeApplicationStatus,
);

export default router;
