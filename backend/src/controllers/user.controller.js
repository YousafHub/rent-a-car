import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { zSchema } from "../utils/zSchema.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "none",
    maxAge: 3 * 24 * 60 * 60 * 1000,
    path: "/"
};

export const register = asyncHandler(async (req, res, next) => {
    const payload = req.body;

    const schema = zSchema.pick({
        name: true,
        email: true,
        password: true
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
        const formattedErrors = validate.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));
        throw new ApiError(400, "Validation failed", formattedErrors);
    }

    const { name, email, password } = validate.data;

    const existing = await User.findOne({ email });
    if (existing) {
        throw new ApiError(400, "User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });


    return res.status(201).json(
        new ApiResponse(201, {
            id: user._id,
            name: user.name,
            email: user.email
        }, "Signup successful")
    );
});

export const login = asyncHandler(async (req, res, next) => {
    const payload = req.body;

    const schema = zSchema.pick({
        email: true,
        password: true
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
        const formattedErrors = validate.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));
        throw new ApiError(400, "Validation failed", formattedErrors);
    }

    const { email, password } = validate.data;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json(
        new ApiResponse(200, {
            id: user._id,
            name: user.name,
            email: user.email
        }, "Login successful")
    );
});

export const logout = asyncHandler(async (req, res, next) => {  
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        path: "/"
    });
    
    
    return res.status(200).json(
        new ApiResponse(200, null, "Logged out successfully")
    );
});