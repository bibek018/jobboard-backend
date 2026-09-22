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
  getMyApplications
} from "../controllers/jobs.controllers.js";
import {
  jobCreateSchema,
  jobPublishOrCloseSchema,
  getJobSchema,
  jobApplySchema,
} from "../validators/jobs.validator.js";
import {uploadDocument} from "../middlewares/uploadDocument.js";
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
router.get("/mine", roleMiddleware("employer"), getMyJobs);
router.delete("/:id", roleMiddleware("employer"), deleteJob);
router.post(
  "/:id/apply",
  roleMiddleware("candidate"),
  uploadDocument.single("resume"),
  validate(jobApplySchema),
  applyJob,
);
router.get("/applications/mine", roleMiddleware("candidate"), getMyApplications);
export default router;
