import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || 
      req.headers['authorization']?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Access token is missing. Please login.");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);

    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid or expired token.");
    }

    throw new ApiError(401, "Authentication failed. Please provide a valid token.");
  }
};

export { authenticated };
