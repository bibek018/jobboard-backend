import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import { AppError } from "../utils/AppError.js";
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profileImage-JobBoard",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [
      {
        height: 500,
        width: 500,
        crop: "limit",
      },
    ],
  },
});
export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new AppError("Only image files are allowed", 400), false);
    }
    cb(null, true);
  },
});
