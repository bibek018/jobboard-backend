import { AppError } from "../utils/AppError.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resume-JobBoard",
    allowed_formats: ["pdf"],
  },
});

export const uploadDocument = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new AppError("Only PDF files are allowed", 400), false);
    }

    cb(null, true);
  },
});