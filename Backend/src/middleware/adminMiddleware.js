import User from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    if (user.userType !== "admin") {
      return res.status(501).json({
        success: false,
        message: "admin access page only ",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "somthing went wrong while admin authorization",
      error,
    });
  }
};

export { adminAuth };
