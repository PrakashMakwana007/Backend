import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Corrected token retrieval
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        
        if (!token) {
            throw new ApiError(401, "Token is missing");
        }

        // Verify access token
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decode) {
            throw new ApiError(401, "Invalid token");
        }

        // Find user by decoded ID
        const user = await User.findById(decode._id).select("-password -refreshTokens");
        if (!user) {
            throw new ApiError(401, "User not found by token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(500, "Token is not valid");
    }
});
