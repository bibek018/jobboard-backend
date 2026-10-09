import { z } from "zod";

export const userRegisterSchema = z
  .object({
    name: z.string().min(3, "Name must be minimum of 3 letters."),
    email: z.email("Invalid email format"),
    phone_no: z
      .string()
      .regex(
        /^\+977\d{10}$/,
        "Phone number must start with +977 followed by 10 digits",
      )
      .optional(),
    password: z
      .string()
      .min(8, "Password must be minimum of 8 letters.")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Password must include uppercase, lowercase, number, and special character",
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be minimum of 8 letters."),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password do not match",
    path: ["confirmPassword"],
  });

export const userLoginSchema = z
  .object({
    email: z.email("Invalid email format"),
    password: z.string(),
  })
  .strict();

export const userRoleSetSchema = z
  .object({
    role: z.enum(
      ["candidate", "employer"],
      "Please select candidate or employer as a role",
    ),
  })
  .strict();

export const employerOnboardSchema = z
  .object({
    companyName: z
      .string({ required_error: "Company name is required" })
      .trim()
      .min(1, { message: "Company name is required" }),

    companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"], {
      invalid_type_error: "Company size is required",
    }),

    industry: z
      .string({ required_error: "Industry is required" })
      .trim()
      .min(1, { message: "Industry is required" }),

    description: z
      .string({ required_error: "Description is required" })
      .trim()
      .min(1, { message: "Description is required" })
      .max(300, { message: "Description must not exceed 300 chars." }),
  })
  .strict();

const jsonArrayOfStrings = z.string().transform((value, ctx) => {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      ctx.addIssue({
        code: "custom",
        message: "Expected an array",
      });
      return z.NEVER;
    }
    return parsed;
  } catch {
    ctx.addIssue({
      code: "custom",
      message: "Expected an array",
    });
    return z.NEVER;
  }
});

export const candidateOnboardSchema = z
  .object({
    skills: jsonArrayOfStrings.pipe(
      z
        .array(z.string().trim().min(1, { message: "Skill cannot be empty" }), {
          invalid_type_error: "Please provide some skills",
        })
        .min(1, { message: "Please provide at least one skill" }),
    ),

    preferredJobType: jsonArrayOfStrings.pipe(
      z
        .array(
          z.string().trim().min(1, { message: "Job type cannot be empty" }),
          { invalid_type_error: "Please provide your preferred job type." },
        )
        .min(1, { message: "Please provide at least one preferred job type." }),
    ),

    preferredLocation: jsonArrayOfStrings.pipe(
      z
        .array(
          z
            .string()
            .trim()
            .min(1, { message: "Preferred location cannot be empty" }),
          { invalid_type_error: "Please provide your preferred location." },
        )
        .min(1, { message: "Please provide at least one preferred location." }),
    ),
  })
  .strict();
