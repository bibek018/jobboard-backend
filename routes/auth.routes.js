import express from "express";
import { userRegisterSchema, userLoginSchema } from "../validators/user.validator.js";
import { createAccount , loginAccount} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validate.js";
const router = express.Router();
router.post("/register", validate(userRegisterSchema), createAccount);
router.post("/login", validate(userLoginSchema), loginAccount);
export default router;
