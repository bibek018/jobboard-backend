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
import {
  googleAuthHandler,
  facebookAuthHandler,
  linkedInAuthHandler,
  githubAuthHandler,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.js";
import { authLimiter } from "../utils/rateLimiter.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { requireRoleSet } from "../middlewares/requireRoleSet.js";
import { upload } from "../middlewares/upload.js";
import passport from "../utils/passport.js";
const router = express.Router();

//manual registration route
router.post(
  "/v1/register",
  authLimiter,
  validate(userRegisterSchema),
  createAccount,
);
//login route
router.post("/v1/login", authLimiter, validate(userLoginSchema), loginAccount);

//OAuth Registration Routes
router.get(
  "/v1/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }),
);
router.get(
  "/v1/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/register",
    session: false,
  }),
  googleAuthHandler,
);
router.get(
  "/v1/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
  }),
);
router.get(
  "/v1/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/register",
    session: false,
  }),
  facebookAuthHandler,
);
router.get(
  "/v1/linkedIn",
  passport.authenticate("linkedIn", {
    scope: ["openid", "profile", "email"],
    session: false,
  }),
);
router.get(
  "/v1/linkedIn/callback",
  passport.authenticate("linkedIn", {
    failureRedirect: "/register",
    session: false,
  }),
  linkedInAuthHandler,
);
router.get(
  "/v1/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  }),
);

router.get(
  "/v1/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/register",
    session: false,
  }),
  githubAuthHandler,
);

//Auth Middleware
router.use(authMiddleware);
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
