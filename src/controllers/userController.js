import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js"; // Import ApiResponse for success responses
import { ApiError } from "../utils/ApiError.js"; // Import ApiError for error responses
import { asyncHandler } from "../utils/AsyncHandler.js";
import { fileUploadOnCloudinary } from "../utils/fileuploadoncloudinary.js";
import cookieParser from "cookie-parser";

const createAccessTokenandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return refreshToken, accessToken;
  } catch (error) {
    throw new ApiError(501, "somthing went wrong while createing tokens");
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, address, userName, phone, userType, answer } =
    req.body;

  if (
    [email, password, address, userName, phone, userType, answer].some(
      (fields) => fields?.trim() == ""
    )
  ) {
    throw new ApiError(404, "All fildes are required");
  }

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new ApiError(501, "user alrady exist");
  }

  const profileLocalPath = req.file?.path;
  console.log(req.file);

  if (!profileLocalPath) {
    throw new ApiError(
      501,
      "profile not uploaded succesfully on over local path"
    );
  }

  const profile = await fileUploadOnCloudinary(profileLocalPath);

  if (!profile) {
    throw new ApiError(
      501,
      "somthing went wrong while profile uploading on cloudinary"
    );
  }

  let hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashPassword,
    address,
    userName,
    phone,
    userType,
    answer,
    profile: profile.url || "",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user, "user register successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, userType } = req.body;

  if ([email, password, userType].some((fildes) => fildes?.trim() == "")) {
    throw new ApiError(404, "Email , Password, UserType Is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(501, "Email not register");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new ApiError(404, "incorect password");
  }

  if (user.userType !== userType) {
    throw new ApiError(501, "userType is wrong");
  }

  const { refreshToken, accessToken } = createAccessTokenandRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  const loggedInUser = await User.findById(user._id);

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        201,
        { user: loggedInUser, refreshToken, accessToken },
        "User logged in successfully"
      )
    );
});

const getUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    throw new ApiError(400, "User ID is not available.");
  }

  const user = await User.findById(_id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User found successfully."));
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);

  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { address, phone } = req.body;

  if (address) user.address = address;
  if (phone) user.phone = phone;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, answer } = req.body;
  if (!email || !newPassword || !answer) {
    throw new ApiError(400, "All fields are required to reset the password.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "Email not registered.");
  }

  if (user.answer !== answer) {
    throw new ApiError(401, "Security answer does not match.");
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashPassword;

  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully."));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully."));
});

const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);

  if (!user) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { newPassword, oldPassword } = req.body;

  if (!newPassword || !oldPassword) {
    throw new ApiError(400, "Both new and old passwords are required.");
  }

  const verifyPassword = await bcrypt.compare(oldPassword, user.password);

  if (!verifyPassword) {
    throw new ApiError(401, "The old password is incorrect.");
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashPassword;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully."));
});

export {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  resetPassword,
  deleteUser,
  updatePassword,
};
