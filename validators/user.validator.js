import { refine, z } from "zod";
export const userRegisterSchema = z
  .object({
    name: z.string().min(3, "Name must be minimum of 3 letters."),
    email: z.email("Invalid email format"),
    phone_no: z
      .string()
      .regex(/^\+977\d{10}$/, "Phone number must be 10 digits long"),
    role: z.enum(["candidate", "employer"], "Invalid role chosen").optional(),
    password: z
      .string()
      .min(8, "Password must be minimum of 8 letters.")
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/),
    confirmPassword: z
      .string()
      .min(8, "Password must be minimum of 8 letters.")
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password do not match",
    path: ["confirmpassword"],
  })
  .strict();

export const userLoginSchema = z
  .object({
    email: z.email("Invalid email format"),
    password: z.string(),
  })
  .strict();
