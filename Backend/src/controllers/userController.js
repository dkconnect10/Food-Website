import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js"; // Import ApiResponse for success responses
import { ApiError } from "../utils/ApiError.js"; // Import ApiError for error responses
import { asyncHandler } from "../utils/AsyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, address, userName, phone, userType, answer } =
    req.body;

  if (
    [email, password, phone, address, userName, userType, answer].some(
      (fields) => typeof fields !== "string" || fields.trim() === ""
    )
  ) {
    throw new ApiError(
      400,
      "All fields are required: email, password, user type, security answer, address, username, and phone. Please fill them out."
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(
      409,
      `The email '${email}' is already registered. Please log in or use a different email.`
    );
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashPassword,
    address,
    userName,
    phone,
    userType,
    answer,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        user,
        "User registered successfully. You can now log in."
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    throw new ApiError(400, "Email, password, and userType are required.");
  }

  const user = await User.findOne({ email, userType });
  if (!user) {
    throw new ApiError(404, "User does not exist. Please register.");
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw new ApiError(
      401,
      "The provided email or password is incorrect. Please check your details and try again."
    );
  }

  user.password = undefined;

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          token,
          user: {
            id: user._id,
            email: user.email,
            userName: user.userName,
            userType: user.userType,
          },
        },
        "User logged in successfully."
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
