import logger from "../utils/logger.js";
export const requestlogger = (req, res, next) => {
  logger.http("Incoming request", { method: req.method, originalUrl: req.originalUrl });
  next();
};
