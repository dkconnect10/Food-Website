import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js"; // Import ApiResponse for success responses
import { ApiError } from "../utils/ApiError.js"; // Import ApiError for error responses
import { asyncHandler } from "../utils/AsyncHandler.js";
import { fileUploadOnCloudinary } from "../utils/fileuploadoncloudinary.js";
import nodemailer from "nodemailer";
import { text } from "express";
import crypto from "crypto";
import { error } from "console";

const createAccessTokenandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Something went wrong while creating tokens.");
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

  if ([email, password, userType].some((field) => !field?.trim())) {
    throw new ApiError(400, "Email, Password, and UserType are required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Email is not registered.");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new ApiError(401, "Incorrect password.");
  }

  if (user.userType !== userType) {
    throw new ApiError(401, "Invalid user type.");
  }

  const { refreshToken, accessToken } = await createAccessTokenandRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, refreshToken, accessToken },
        "User logged in successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          refreshToken: null,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200) // Use 200 for successful logout
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .json(
        new ApiResponse(
          200,
          user,
          "User has been logged out successfully, and cookies have been cleared."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "An error occurred while logging out the user. Please try again later."
    );
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshTokenFromClient =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!refreshTokenFromClient) {
    throw new ApiError(
      400,
      "REFRESH_TOKEN_MISSING",
      "Refresh token is required but not provided."
    );
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      refreshTokenFromClient,
      process.env.REFRESH_TOKEN_KEY
    );
  } catch (error) {
    throw new ApiError(
      401,
      "INVALID_REFRESH_TOKEN",
      "The provided refresh token is invalid or expired."
    );
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(
      401,
      "USER_NOT_FOUND",
      "The user associated with this token does not exist."
    );
  }

  if (user.refreshToken !== refreshTokenFromClient) {
    throw new ApiError(
      401,
      "TOKEN_MISMATCH",
      "The refresh token does not match the one stored for the user."
    );
  }

  const { accessToken, refreshToken } = await createAccessTokenandRefreshToken(
    user._id
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "Strict", // Prevent CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { refreshToken, accessToken },
        "Tokens refreshed successfully. You can continue using the service."
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

  const { address, phone, userType } = req.body;

  if (address) user.address = address;
  if (phone) user.phone = phone;
  if (userType) user.userType = userType;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const profileLocalPath = req.file?.path;

  if (!profileLocalPath) {
    throw new ApiError(404, "Profile not available in the local path.");
  }
  const cloudinaryProfile = await fileUploadOnCloudinary(profileLocalPath);

  if (!cloudinaryProfile.url) {
    throw new ApiError(501, "Failed to upload profile to Cloudinary.");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { profile: cloudinaryProfile.url },
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found for updating profile.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Profile uploaded to Cloudinary successfully."));
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

const deleteProfile = asyncHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: { profile: "" },
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found for profile deletion.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile deleted successfully."));
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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = crypto.randomBytes(3).toString("hex");

  user.otp = otp;
  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is ${otp}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    return res.status(200).json({ message: "OTP sent to your email" });
  });
});

const verfiyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!(email && otp)) {
    throw new ApiError(401, "Enter Email and Otp");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "Enter Valid email Id");
  }

  if (user.otp !== otp) {
    throw new ApiError(501, "Enter Valid OTP Please");
  }

  return res.status(201).json(new ApiResponse(201, "valid OTP "));
});

const updateingPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, confiremPassword } = req.body;

  if (
    [email, newPassword, confiremPassword].some(
      (fildes) => fildes?.trim() == ""
    )
  ) {
    throw new ApiError(401, "Enter email ,  newPassword and confiremPassword");
  }

  if (!(newPassword && confiremPassword)) {
    throw new ApiError(404, "newPassword Or confiremPassword Enter Same");
  }

  if (!email) {
    throw new ApiError(404, "Enter valid email");
  }

  const hashPassword = await bcrypt.hash(newPassword,10)

  const PasswordUpdated = await User.findOneAndUpdate(
     {email} ,
    {
      password: hashPassword,
    },
    { new: true }
  );

  if (!PasswordUpdated) {
    throw new ApiError(501, "Password not updated successfully");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password updated successfully",
    text: `Your updated Password is ${newPassword}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new ApiError(
        501,
        error.message,
        "somthing went wrong while send mail of Updated Password"
      );
    }
    res.status(201).json(new ApiResponse(201, "Email send successfully"));
  });
  return res
    .status(201)
    .json(
      new ApiResponse(201, PasswordUpdated, "Password Updated successfully")
    );
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUser,
  updateUser,
  updateProfile,
  resetPassword,
  deleteUser,
  deleteProfile,
  updatePassword,
  forgotPassword,
  verfiyOtp,
  updateingPassword,
};
