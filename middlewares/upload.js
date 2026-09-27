import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { AppError } from "../utils/AppError.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    if (file.fieldname === "resume") {
      return {
        folder: "resume-jobBoard",
        allowed_formats: ["pdf"],
      };
    }

    if (file.fieldname === "avatar") {
      return {
        folder: "profile-avatars",
        allowed_formats: ["png", "jpg", "jpeg"],
        transformation: [
          {
            height: 500,
            width: 500,
            crop: "limit",
          },
        ],
      };
    }
    if (file.fieldname === "companyLogo") {
      return {
        folder: "company-Logos",
        allowed_formats: ["png", "jpg", "jpeg"],
      };
    }

    throw new AppError("Unexpected file received", 400);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
        return cb(
          new AppError("Avatar must be a JPEG, PNG, or WebP image", 400),
          false,
        );
      }
      return cb(null, true);
    }
    if (file.fieldname === "resume") {
      if (file.mimetype !== "application/pdf") {
        return cb(new AppError("Resume must be a PDF", 400), false);
      }

      return cb(null, true);
    }
    if (file.fieldname === "companyLogo") {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
        return cb(
          new AppError("Avatar must be a JPEG, PNG, or WebP image", 400),
          false,
        );
      }
      return cb(null, true);
    }
    cb(new AppError("Unexpected file received", 400), false);
  },
});
