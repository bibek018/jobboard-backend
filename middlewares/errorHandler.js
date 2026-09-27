import logger from "../utils/logger.js";
import multer from "multer";
export const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: 400,
      message: err.message,
      success: false,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      status: 400,
      message: "Invalid ID",
      success: false,
    });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: 401,
      message: "Invalid access token",
      success: false,
    });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: 401,
      message: "Access Token Expired",
      success: false,
    });
  }
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "You have already applied to this job",
    });
  }
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must not exceed 1 MB",
      });
    }
  }
  const status = err.statusCode || 500;
  if (!err.isOperational && status === 500) {
    logger.error("Something went wrong!", {
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.url,
    });
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong", success: false });
  }

  logger.warn(`${err.message}`, {
    status,
    message: err.message,
    success: false,
    ...(err.details && { details: err.details }),
  });
  res.status(status).json({
    status,
    message: err.message,
    success: false,
    ...(err.details && { details: err.details }),
  });
};
