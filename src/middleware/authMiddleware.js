import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token =
      req.headers["authorization"].split(" ")[1] ||
      req.headers["authorization"];

    if (!token) {
      console.warn("Token missing in the Authorization header.");
      return res.status(401).json({
        success: false,
        message: "Token is missing or invalid.",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.warn("Token verification failed:", err.message);
        return res.status(401).json({
          success: false,
          message: "Unauthorized user, invalid token.",
        });
      }

      console.log("Decoded Token Payload:", decoded); // ✅ Key checkpoint

      if (!decoded._id) {
        console.warn("Decoded token does not contain '_id'");
        return res.status(400).json({
          success: false,
          message: "Token is valid but '_id' is missing in payload.",
        });
      }

      req.user = { _id: decoded._id }; // Correct key from the token payload
      console.log("User ID from token set in req.user:", req.user._id); // ✅ Check if _id is being set properly

      next();
    });
  } catch (error) {
    console.error("Error in authUser middleware:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during authentication.",
    });
  }
};

export { authUser };
