import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    rentPerDay: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

export const Vehicle =  mongoose.model("Vehicle", vehicleSchema);