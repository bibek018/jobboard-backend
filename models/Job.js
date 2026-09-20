import mongoose, { mongo } from "mongoose";
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        enum: ["NPR", "USD"],
        required: true,
      },
      period: {
        type: String,
        enum: ["year", "month", "hour"],
        required: true,
      },
    },

    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Freelance", "Contract"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "Draft"],
      default: "Draft",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);
export const Job = mongoose.model("Job", jobSchema);
