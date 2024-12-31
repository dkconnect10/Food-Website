import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { email, password, address, userName, phone, userType, answer } =
      req.body;

    if (
      !email ||
      !password ||
      !phone ||
      !address ||
      !userName ||
      !userType ||
      !answer
    ) {
      return res.status(400).json({
        message:
          "All fields are required: email, password, user type, security answer, address, username, and phone. Please fill them out.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: `The email '${email}' is already registered. Please log in or use a different email.`,
        success: false,
      });
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

    return res.status(201).json({
      success: true,
      message: "User registered successfully. You can now log in.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "An error occurred during registration. Please try again later or contact support if the issue persists.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and userType are required.",
      });
    }

    const user = await User.findOne({ email, userType });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please register.",
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).json({
        message:
          "The provided email or password is incorrect. Please check your details and try again.",
        success: false,
      });
    }

    user.password = undefined;

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      token,
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        userType: user.userType,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again later.",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is not available.",
      });
    }

    const user = await User.findById(_id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the user.",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { address, phone } = req.body;

    if (address) user.address = address;
    if (phone) user.phone = phone;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while updating the user. Please try again.",
      success: false,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email || !newPassword || !answer) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to reset the password.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered.",
      });
    }

    if (user.answer !== answer) {
      return res.status(401).json({
        success: false,
        message: "Security answer does not match.",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while resetting the password. Please try again later.",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the user. Please try again.",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const { newPassword, oldPassword } = req.body;

    if (!newPassword || !oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Both new and old passwords are required.",
      });
    }

    const verifyPassword = await bcrypt.compare(oldPassword, user.password);

    if (!verifyPassword) {
      return res.status(401).json({
        success: false,
        message: "The old password is incorrect.",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the password. Please try again later.",
    });
  }
};

export {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  resetPassword,
  deleteUser,
  updatePassword,
};
