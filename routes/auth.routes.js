import express from "express";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../validators/user.validator.js";
import {
  createAccount,
  loginAccount,
  handleRefresh,
  googleAuthHandler,
  facebookAuthHandler,
  linkedInAuthHandler,
  githubAuthHandler,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.js";
import { authLimiter } from "../utils/rateLimiter.js";

import passport from "../utils/passport.js";
const router = express.Router();

//manual registration route
router.post(
  "/v1/signup",
  authLimiter,
  validate(userRegisterSchema),
  createAccount,
);
//login route
router.post("/v1/login", authLimiter, validate(userLoginSchema), loginAccount);

//Refresh Router
router.post("/v1/refresh", handleRefresh);
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

export default router;
