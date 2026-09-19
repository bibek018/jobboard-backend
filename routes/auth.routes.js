import express from "express";
import { userRegisterSchema } from "../validators/user.validator.js";
import { createAccount } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.js";
const router = express.Router();
router.post("/register", validate(userRegisterSchema), createAccount);
export default router;
