import { Booking } from "../models/Booking.model.js";
import { Vehicle } from "../models/Vehicle.model.js";
import { zSchema } from "../utils/zSchema.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const createBooking = asyncHandler(async (req, res, next) => {
    const payload = req.body;

    const schema = zSchema.pick({
        customerId: true,
        vehicleId: true,
        startDate: true,
        endDate: true
    });

    const validated = schema.safeParse(payload);
    if (!validated.success) {
        throw new ApiError(400, "Invalid fields");
    }

    const { customerId, vehicleId, startDate, endDate } = validated.data;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
        throw new ApiError(400, "End date must be after start date");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const vehicle = await Vehicle.findById(vehicleId).session(session);
        if (!vehicle) throw new ApiError(404, "Vehicle not found");

        if (!vehicle.available) {
            throw new ApiError(400, "Vehicle not available");
        }

        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = days * vehicle.rentPerDay;

        const booking = await Booking.create([{
            customerId,
            vehicleId,
            startDate: start,
            endDate: end,
            totalPrice
        }], { session });

        vehicle.available = false;
        await vehicle.save({ session });

        await session.commitTransaction();
        
        return res.status(201).json(
            new ApiResponse(201, booking[0], "Booking created successfully")
        );
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export const updateBooking = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingBooking = await Booking.findById(id).session(session);
        if (!existingBooking) {
            throw new ApiError(404, "Booking not found");
        }

        const updateData = {};
        let needToRecalculate = false;
        let oldVehicleId = existingBooking.vehicleId;
        let newVehicleId = existingBooking.vehicleId;

        if (payload.startDate || payload.endDate) {
            const start = payload.startDate ? new Date(payload.startDate) : existingBooking.startDate;
            const end = payload.endDate ? new Date(payload.endDate) : existingBooking.endDate;
            
            if (start >= end) {
                throw new ApiError(400, "End date must be after start date");
            }
            
            updateData.startDate = start;
            updateData.endDate = end;
            needToRecalculate = true;
        }

        if (payload.vehicleId && payload.vehicleId !== existingBooking.vehicleId.toString()) {
            const newVehicle = await Vehicle.findById(payload.vehicleId).session(session);
            if (!newVehicle) {
                throw new ApiError(404, "New vehicle not found");
            }
            if (!newVehicle.available) {
                throw new ApiError(400, "New vehicle is not available");
            }
            
            updateData.vehicleId = payload.vehicleId;
            newVehicleId = payload.vehicleId;
            needToRecalculate = true;
        }

        if (payload.customerId) {
            updateData.customerId = payload.customerId;
        }

        if (needToRecalculate) {
            const start = updateData.startDate || existingBooking.startDate;
            const end = updateData.endDate || existingBooking.endDate;
            const vehicleId = updateData.vehicleId || existingBooking.vehicleId;
            
            const vehicle = await Vehicle.findById(vehicleId).session(session);
            if (!vehicle) {
                throw new ApiError(404, "Vehicle not found");
            }
            
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            updateData.totalPrice = days * vehicle.rentPerDay;
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: 'after', session }
        ).populate("customerId", "name email")
         .populate("vehicleId", "name brand rentPerDay");

        if (payload.vehicleId && payload.vehicleId !== existingBooking.vehicleId.toString()) {
            const oldVehicle = await Vehicle.findById(oldVehicleId).session(session);
            if (oldVehicle) {
                const otherBookings = await Booking.findOne({
                    vehicleId: oldVehicleId,
                    _id: { $ne: id }
                }).session(session);
                
                if (!otherBookings) {
                    oldVehicle.available = true;
                    await oldVehicle.save({ session });
                }
            }
            
            const newVehicle = await Vehicle.findById(newVehicleId).session(session);
            if (newVehicle) {
                newVehicle.available = false;
                await newVehicle.save({ session });
            }
        }

        await session.commitTransaction();
        
        return res.status(200).json(
            new ApiResponse(200, updatedBooking, "Booking updated successfully")
        );
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export const deleteBooking = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const booking = await Booking.findById(id).session(session);
        if (!booking) {
            throw new ApiError(404, "Booking not found");
        }

        const vehicle = await Vehicle.findById(booking.vehicleId).session(session);
        if (vehicle) {
            const otherBookings = await Booking.findOne({
                vehicleId: booking.vehicleId,
                _id: { $ne: id }
            }).session(session);
            
            if (!otherBookings) {
                vehicle.available = true;
                await vehicle.save({ session });
            }
        }

        await booking.deleteOne({ session });
        await session.commitTransaction();

        return res.status(200).json(
            new ApiResponse(200, null, "Booking cancelled successfully")
        );
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export const getBookings = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [bookings, total] = await Promise.all([
        Booking.find()
            .populate("customerId", "name email phone")
            .populate("vehicleId", "name brand rentPerDay")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Booking.countDocuments()
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            bookings,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        }, "Bookings fetched successfully")
    );
});

export const getBookingById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const booking = await Booking.findById(id)
        .populate("customerId", "name email phone")
        .populate("vehicleId", "name brand rentPerDay");

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    return res.status(200).json(
        new ApiResponse(200, booking, "Booking fetched successfully")
    );
});