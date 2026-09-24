import { z } from "zod";
import mongoose from "mongoose";
export const jobCreateSchema = z
  .object({
    title: z
      .string({
        error: "Job title is required.",
      })
      .trim()
      .min(3, "Job title must be at least 3 characters.")
      .max(100, "Job title must not exceed 100 characters."),

    description: z
      .string({
        error: "Job description is required.",
      })
      .trim()
      .min(50, "Job description must be at least 50 characters.")
      .max(350, "Job description must not exceed 350 characters."),

    location: z
      .string({
        error: "Job location is required.",
      })
      .trim()
      .min(3, "Location must be at least 3 characters.")
      .max(100, "Location must not exceed 100 characters."),

    salary: z
      .object({
        min: z
          .number({
            error: "Minimum salary is required and must be a number.",
          })
          .nonnegative("Minimum salary cannot be negative."),

        max: z
          .number({
            error: "Maximum salary is required and must be a number.",
          })
          .nonnegative("Maximum salary cannot be negative."),

        currency: z.enum(
          ["NPR", "USD"],
          "Please choose a valid currency: NPR or USD.",
        ),

        period: z.enum(
          ["year", "month", "hour"],
          "Please choose a valid period: year, month, or hour.",
        ),
      })
      .refine((salary) => salary.min <= salary.max, {
        message: "Minimum salary cannot be greater than maximum salary.",
        path: ["min"],
      }),

    type: z.enum(
      ["Full-time", "Part-time", "Internship", "Freelance", "Contract"],
      "Please select a valid job type.",
    ),
  })
  .strict();

export const jobPublishOrCloseSchema = z
  .object({
    status: z.enum(["Open", "Closed"], "Please select a valid job status"),
  })
  .strict();
export const getJobSchema = z.object({
  page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(50, "Limit must be at most 50")
    .default(10),

  location: z.string().trim().optional(),

  type: z
    .enum(["Full-time", "Part-time", "Internship", "Freelance", "Contract"])
    .optional(),

  keyword: z.string().trim().optional(),

  sort: z.enum(["createdAt", "updatedAt"]).default("createdAt"),

  order: z.enum(["asc", "desc"]).default("desc"),
});

export const jobApplySchema = z
  .object({
    jobId: z
      .string()
      .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: "Invalid job ID",
      }),
  })
  .strict();

export const applicationStatusChangeSchema = z.object({
  status: z.enum(
    ["Reviewing", "Interviewing", "Selected", "Rejected"],
    "Please select a valid status",
  ),
});
export const myJobsSchema = z
  .object({
    page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
    limit: z.coerce
      .number()
      .int()
      .min(5, "Page limit must be minimum 5")
      .max(50, "Page limit can't exceed 50")
      .default(10),
  })
  .strict();
export const getMyApplicationsSchema = z
  .object({
    page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
    limit: z.coerce
      .number()
      .int()
      .min(5, "Page limit must be minimum 5")
      .max(50, "Page limit can't exceed 50")
      .default(10),
  })
  .strict();

export const getApplicantsSchema = z
  .object({
    page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
    limit: z.coerce
      .number()
      .int()
      .min(5, "Page limit must be minimum 5")
      .max(50, "Page limit can't exceed 50")
      .default(10),
    sort: z
      .enum(["newest", "oldest"], "Please choose a valid status")
      .default("newest"),
  })
  .strict();
