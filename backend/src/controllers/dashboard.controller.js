import { Vehicle } from "../models/Vehicle.model.js";
import { Customer } from "../models/Customer.model.js";
import { Booking } from "../models/Booking.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res, next) => {
    const totalVehicles = await Vehicle.countDocuments();
    const availableVehicles = await Vehicle.countDocuments({ available: true });

    const totalCustomers = await Customer.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenueAgg = await Booking.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" }
            }
        }
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    return res.status(200).json(
        new ApiResponse(200, {
            totalVehicles,
            availableVehicles,
            totalCustomers,
            totalBookings,
            totalRevenue
        })
    );
});