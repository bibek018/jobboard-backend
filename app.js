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

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentails: true,
  }),
);
app.use(helmet());
app.use(requestlogger);
app.use(cookieParser());
app.use(generalLimiter);
app.use("/auth", authRouter);
app.use("/jobs", jobRouter);
app.use(notFound);
app.use(errorHandler);
export default app;
