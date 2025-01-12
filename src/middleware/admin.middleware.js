import { ApiError } from "../utils/ApiError.js";
import User from "../models/userModel.js";

const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne(req.user?._id);
    if (!user) {
      throw new ApiError(404, "user not found");
    }
    if (user.userType !== "admin") {
      throw new ApiError(501, "admin accessOnly");
    }
    next()
  } catch (error) {
    console.log(error);
    throw new ApiError(
      501,
      error,
      "somthing went wrong while authenticate admin"
    );
  }
};

export{authAdmin}