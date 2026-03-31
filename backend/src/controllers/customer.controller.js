import { Customer } from "../models/Customer.model.js";
import { zSchema } from "../utils/zSchema.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCustomer = asyncHandler(async (req, res, next) => {
    const payload = req.body;

    const schema = zSchema.pick({
        name: true,
        email: true,
        phone: true
    });

    const validated = schema.safeParse(payload);
    if (!validated.success) {
        throw new ApiError(400, "Invalid fields", formattedErrors);
    }

    const { name, email, phone } = validated.data;

    const customer = await Customer.create({
        name,
        email,
        phone
    });

    return res.status(201).json(
        new ApiResponse(201, customer, "Customer created")
    );
});

export const getCustomers = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [customers, total] = await Promise.all([
        Customer.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Customer.countDocuments()
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            customers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        }, "Customers fetched successfully")
    );
});

export const getCustomerById = asyncHandler(async (req, res, next) => {
    const params = req.params;

    const schema = zSchema.pick({ id: true });
    const validated = schema.safeParse(params);

    if (!validated.success) {
        throw new ApiError(400, "Invalid ID");
    }

    const { id } = validated.data;

    const customer = await Customer.findById(id);
    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    return res.status(200).json(
        new ApiResponse(200, customer, "Customer fetched successfully")
    );
});

export const searchCustomers = asyncHandler(async (req, res, next) => {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
        return res.status(200).json(new ApiResponse(200, [], "No search term provided"));
    }
    
    const customers = await Customer.find({
        $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
            { phone: { $regex: q, $options: 'i' } }
        ]
    }).limit(10);
    
    return res.status(200).json(new ApiResponse(200, customers, "Customers fetched"));
});

export const updateCustomer = asyncHandler(async (req, res, next) => {
    const payload = req.body;
    const params = req.params;

    const bodySchema = zSchema.pick({
        name: true,
        email: true,
        phone: true
    }).partial();

    const bodyValidated = bodySchema.safeParse(payload);
    if (!bodyValidated.success) {
        throw new ApiError(400, "Invalid fields", formattedErrors);
    }

    const paramSchema = zSchema.pick({ id: true });
    const paramValidated = paramSchema.safeParse(params);
    if (!paramValidated.success) {
        throw new ApiError(400, "Invalid ID");
    }

    const { id } = paramValidated.data;
    const updateData = bodyValidated.data;

    const customer = await Customer.findByIdAndUpdate(
        id,
        updateData,
        { returnDocument: 'after' }
    );

    if (!customer) throw new ApiError(404, "Customer not found");

    return res.status(200).json(
        new ApiResponse(200, customer, "Customer updated")
    );
});

export const deleteCustomer = asyncHandler(async (req, res, next) => {
    const params = req.params;

    const schema = zSchema.pick({ id: true });
    const validated = schema.safeParse(params);

    if (!validated.success) {
        throw new ApiError(400, "Invalid ID");
    }

    const { id } = validated.data;

    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) throw new ApiError(404, "Customer not found");

    return res.status(200).json(
        new ApiResponse(200, null, "Customer deleted")
    );
});