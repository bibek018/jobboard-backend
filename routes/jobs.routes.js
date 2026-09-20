import express from "express";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createJob,
  publishOrCloseJob,
  getMyJobs,
  deleteJob,
} from "../controllers/jobs.controllers.js";
import {
  jobCreateSchema,
  jobPublishOrCloseSchema,
} from "../validators/jobs.validator.js";
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
router.get("/mine", roleMiddleware("employer"), getMyJobs);
router.delete("/:id", roleMiddleware("employer"), deleteJob )
export default router;
