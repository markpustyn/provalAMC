import { z } from "zod";

export const RegisterSchema = z
  .object({
    fname: z.string().min(1, { message: "Fist name is required" }),
    lname: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email(),
    phone: z.string(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    companyName: z.string().min(1, { message: "Company name is required" }),
    licenseNum: z.string().min(1, { message: "License number is required" }),
    street: z.string().min(1, { message: "Street address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(2, { message: "State is required" }),
    zip: z.string().min(5, { message: "ZIP code must be at least 5 digits" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
