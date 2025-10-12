import {z} from "zod";

export const signupSchema = z.object({
  username: z.string().min(3, "Name must be at least 3 characters").max(50, "Username must be less that or equal to 50"),
  email: z.string().email("Invalid email address").min(5, "email must be at least 5 characters").max(255, "Email must be less that or equal to 255"),
  password: z.string().min(5, "Password must be at least 5 characters").max(255, "Password must be less that or equal to 255"),
})
export const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(5, "email must be at least 5 characters").max(255, "Email must be less that or equal to 255"),
  password: z.string().min(5, "Password must be at least 5 characters").max(255, "Password must be less that or equal to 255"),
})