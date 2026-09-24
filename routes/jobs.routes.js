import express from "express";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createJob,
  publishOrCloseJob,
  getMyJobs,
  deleteJob,
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
import { uploadDocument } from "../middlewares/uploadDocument.js";
const router = express.Router();
router.post(
  "/",
  roleMiddleware("employer"),
  validate(jobCreateSchema),
  createJob,
);
router.patch(
  "/:id",
  roleMiddleware("employer"),
  validate(jobPublishOrCloseSchema),
  publishOrCloseJob,
);
router.get("/", validate(getJobSchema, "query"), getJobsForPublic);
router.get(
  "/myJobs",
  validate(myJobsSchema),
  roleMiddleware("employer"),
  getMyJobs,
);
router.delete("/:id", roleMiddleware("employer"), deleteJob);
router.post(
  "/:id/apply",
  roleMiddleware("candidate"),
  uploadDocument.single("resume"),
  validate(jobApplySchema),
  applyJob,
);
router.get(
  "/applications/my-applications",
  roleMiddleware("candidate"),
  validate(getMyApplicationsSchema, "query"),
  getMyApplications,
);

router.get(
  "/:id/applicants",
  roleMiddleware("employer"),
  validate(getApplicantsSchema, "query"),
  getJobApplicants,
);
router.patch(
  "/applications/:id/status",
  roleMiddleware("employer"),
  validate(applicationStatusChangeSchema),
  changeApplicationStatus,
);
export default router;
