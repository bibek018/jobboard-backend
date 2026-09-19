import express from "express";
import authRouter from "./routes/auth.routes.js";
import { requestlogger } from "./middlewares/requestLogger.js";
import {notFound} from "./middlewares/notFound.js"
import {errorHandler} from "./middlewares/errorHandler.js"
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(requestlogger);
app.use(cookieParser())
app.use("/auth", authRouter);
app.use(notFound);
app.use(errorHandler);
export default app;
