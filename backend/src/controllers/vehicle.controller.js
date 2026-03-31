import { zSchema } from "../utils/zSchema.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Vehicle } from "../models/Vehicle.model.js";

export const createVehicle = asyncHandler(async (req, res, next) => {
    const payload = req.body;

    const schema = zSchema.pick({
        name: true,
        brand: true,
        rentPerDay: true,
        available: true
    });

    const validated = schema.safeParse(payload);
    if (!validated.success) {
        throw new ApiError(400, "Invalid fields", formattedErrors);
    }

    const { name, brand, rentPerDay, available } = validated.data;

    const vehicle = await Vehicle.create({
        name,
        brand,
        rentPerDay,
        available
    });

    return res.status(201).json(
        new ApiResponse(201, vehicle, "Vehicle created")
    );
});

export const getVehicles = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    
    const [vehicles, total] = await Promise.all([
        Vehicle.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Vehicle.countDocuments()
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            vehicles,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        }, "Vehicles fetched successfully")
    );
});

export const getVehicleById = asyncHandler(async (req, res, next) => {
    const params = req.params;

    const schema = zSchema.pick({ id: true });
    const validated = schema.safeParse(params);

    if (!validated.success) {
        throw new ApiError(400, "Invalid ID");
    }

    const { id } = validated.data;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    return res.status(200).json(
        new ApiResponse(200, vehicle, "Vehicle fetched successfully")
    );
});

export const searchVehicles = asyncHandler(async (req, res, next) => {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
        return res.status(200).json(new ApiResponse(200, [], "No search term provided"));
    }
    
    const vehicles = await Vehicle.find({
        $or: [
            { name: { $regex: q, $options: 'i' } },
            { brand: { $regex: q, $options: 'i' } }
        ],
        available: true
    }).limit(10);
    
    return res.status(200).json(new ApiResponse(200, vehicles, "Vehicles fetched"));
});

export const updateVehicle = asyncHandler(async (req, res, next) => {
    const payload = req.body;
    const params = req.params;

    const bodySchema = zSchema.pick({
        name: true,
        brand: true,
        rentPerDay: true,
        available: true
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

    const vehicle = await Vehicle.findByIdAndUpdate(
        id,
        updateData,
        { returnDocument: 'after' }
    );

    if (!vehicle) throw new ApiError(404, "Vehicle not found");

    return res.status(200).json(
        new ApiResponse(200, vehicle, "Vehicle updated")
    );
});

export const deleteVehicle = asyncHandler(async (req, res, next) => {
    const params = req.params;

    const schema = zSchema.pick({ id: true });
    const validated = schema.safeParse(params);

    if (!validated.success) {
        throw new ApiError(400, "Invalid ID");
    }

    const { id } = validated.data;

    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) throw new ApiError(404, "Vehicle not found");

    return res.status(200).json(
        new ApiResponse(200, null, "Vehicle deleted")
    );
});