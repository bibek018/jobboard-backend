import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"Job"
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },

    resumeUrl: {
      type: String,
      required: true,
    },
    resumePublicId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Submitted", "Reviewing", "Interviewing", "Selected", "Rejected"],
      default: "Submitted",
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: (doc, ret) => {
        if (ret.createdAt) {
          ret.appliedDate = new Date(ret.createdAt).toISOString().split("T")[0];
        }

        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;

        return ret;
      },
    },
  },
);
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
export const Application = mongoose.model("Application", applicationSchema);
