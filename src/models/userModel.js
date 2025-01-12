import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    userType: {
      type: String,
      required: [true, "User type is required"],
      default: "client",
      enum: ["client", "admin", "vendor", "driver"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); // Example for a 10-digit phone number
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    profile: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnyou2ZtjP6jn_NGApj8LpsBjR5veuD5T4sA&s",
    },
    refreshToken: {
      type: String,
    },
    answer: {
      type: String,
      required: [true, "Enter your favrite sport Name"],
    },
  },
  { timestamps: true }
);

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "1d",
  });
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: "10d" }
  );
};

const User = mongoose.model("User", userSchema);
export default User;
