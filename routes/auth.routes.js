import express from "express";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../validators/user.validator.js";
import {
  createAccount,
  loginAccount,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.js";
import { authLimiter } from "../utils/rateLimiter.js";
const router = express.Router();
router.post(
  "/register",
  authLimiter,
  validate(userRegisterSchema),
  createAccount,
);
router.post("/login", authLimiter, validate(userLoginSchema), loginAccount);
export default router;
