import { z } from "zod";

export const zSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string(),
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
    brand: z.string(),
    available: z.boolean().optional(),
    rentPerDay: z.number(),
    customerId: z.string(),
    vehicleId: z.string(),
    startDate: z.string(),
    endDate: z.string()
});