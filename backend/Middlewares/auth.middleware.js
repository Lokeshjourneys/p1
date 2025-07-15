import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {User} from "../Models/user.model.js"





export const verifyJWT = asyncHandler(async (req, res, next) => {
   const token= req.cookies?.accessToken || req.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return next(new ApiError(401, "Unauthorized request, token is missing"));
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }
        req.user = user; // Attach the user to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        throw new ApiError(401, "Invalid token");
    }
})

