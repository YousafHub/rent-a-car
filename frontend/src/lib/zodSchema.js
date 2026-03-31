import { z } from "zod";

export const zSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be less than 30 characters" }),

  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(50, { message: "Password must be less than 50 characters" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
    .regex(/[@$!%*?&#]/, { message: "Must contain at least one special character" }),

  _id: z
    .string()
    .min(3, '_id is required'),
  phone: z.string().min(10, "Number should be valid"),
  brand: z.string().min(3, "Brand should be valid"),
  rentPerDay: z.union([
    z.number().positive('Expected positive value, received negative.'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
  ]),
  customerId: z.string().min(1, "Please select a customer"),
  vehicleId: z.string().min(1, "Please select a vehicle"),
  startDate: z.string().min(1, "Please select start date"),
  endDate: z.string().min(1, "Please select end date"),
});
