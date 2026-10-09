import express from "express";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { requireRoleSet } from "../middlewares/requireRoleSet.js";
import {
  sendProfile,
  roleSetUser,
  onboardingEmployeeHandler,
  onboardingCandidateHandler,
} from "../controllers/profile.controllers.js";
import {
  userRoleSetSchema,
  employerOnboardSchema,
  candidateOnboardSchema,
} from "../validators/user.validator.js";
import { upload } from "../middlewares/upload.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();
router.get("/v1/me", sendProfile);
router.patch("/v1/set-role", validate(userRoleSetSchema), roleSetUser);
router.patch(
  "/v1/onboarding/employer",
  requireRoleSet,
  roleMiddleware("employer"),
  upload.fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  validate(employerOnboardSchema),
  onboardingEmployeeHandler,
);
router.patch(
  "/v1/onboarding/candidate",
  requireRoleSet,
  roleMiddleware("candidate"),
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  validate(candidateOnboardSchema),
  onboardingCandidateHandler,
);

export default router;
