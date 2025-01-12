import { apiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authUser = async (req, res) => {
  try {
    const token = req.cookie?.accessToken || req.headers;

    if (!token) {
      throw new apiError(404, "token not available");
    }

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);

    if (!decodedToken) {
      throw new apiError(501, "token are not matched");
    }

    const user = User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    req.user = user;
    user.save();
    next();
  } catch (error) {
    throw new apiError(404, "somthing went wrong while authenticat user");
  }
};

export { authUser };
