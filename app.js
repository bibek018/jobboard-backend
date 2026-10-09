import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./routes/auth.routes.js";
import { requestlogger } from "./middlewares/requestLogger.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import jobRouter from "./routes/jobs.routes.js";
import { generalLimiter } from "./utils/rateLimiter.js";
import passport from "./utils/passport.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import profileRouter from "./routes/profile.routes.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(helmet());
app.use(passport.initialize());
app.use(requestlogger);
app.use(cookieParser());
// app.use(generalLimiter);
app.use("/api/auth", authRouter);
app.use("/api/profile", authMiddleware, profileRouter);
app.use("/api/jobs", jobRouter);
app.use(notFound);
app.use(errorHandler);
export default app;
