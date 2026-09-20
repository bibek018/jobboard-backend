import { z } from "zod";

export const userRegisterSchema = z
  .object({
    name: z.string().min(3, "Name must be minimum of 3 letters."),
    email: z.email("Invalid email format"),
    phone_no: z
      .string()
      .regex(/^\+977\d{10}$/, "Phone number must start with +977 followed by 10 digits"),
    role: z.enum(["candidate", "employer"], "Invalid role chosen"),
    password: z
      .string()
      .min(8, "Password must be minimum of 8 letters.")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Password must include uppercase, lowercase, number, and special character"
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