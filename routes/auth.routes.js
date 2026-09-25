import express from "express";
import {
  userRegisterSchema,
  userLoginSchema,
  userRoleSetSchema,
  employerOnboardSchema,
} from "../validators/user.validator.js";
import {
  createAccount,
  loginAccount,
  sendProfile,
  roleSetUser,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.js";
import { authLimiter } from "../utils/rateLimiter.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post(
  "/register",
  authLimiter,
  validate(userRegisterSchema),
  createAccount,
);
router.post("/login", authLimiter, validate(userLoginSchema), loginAccount);
router.use(authMiddleware);
router.post("/me", sendProfile);
router.patch("/set-role", validate(userRoleSetSchema), roleSetUser);
router.patch(
  "/onboarding/employer",
  requireRoleSet,
  validate(employerOnboardSchema),
  onboardingEmployeeHandler,
);
router.patch(
  "/onboarding/candidate",
  requireRoleSet,
  validate(candidateOnboardSchema),
  onboardingCandidateHandler,
);
export default router;
