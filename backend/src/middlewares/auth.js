import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js"; // your ApiError class
import { User } from "../models/User.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return next(new ApiError(401, "No token provided"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return next(new ApiError(401, "Invalid token"));

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return next(new ApiError(401, "User not found"));

    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError(401, "Unauthorized"));
  }
};