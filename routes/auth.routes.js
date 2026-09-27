import express from "express";
import {
  userRegisterSchema,
  userLoginSchema,
  userRoleSetSchema,
  employerOnboardSchema,
  candidateOnboardSchema,
} from "../validators/user.validator.js";
import {
  createAccount,
  loginAccount,
  sendProfile,
  roleSetUser,
  onboardingEmployeeHandler,
  onboardingCandidateHandler,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.js";
import { authLimiter } from "../utils/rateLimiter.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { requireRoleSet } from "../middlewares/requireRoleSet.js";
import { upload } from "../middlewares/upload.js";
const router = express.Router();
router.post(
  "/register",
  authLimiter,
  validate(userRegisterSchema),
  createAccount,
);
router.post("/login", authLimiter, validate(userLoginSchema), loginAccount);
router.use(authMiddleware);
router.get("/me", sendProfile);
router.patch("/set-role", validate(userRoleSetSchema), roleSetUser);
router.patch(
  "/onboarding/employer",
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
  "/onboarding/candidate",
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
