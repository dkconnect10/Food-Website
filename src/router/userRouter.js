import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateProfile,
  getUser,
  updateUser,
  resetPassword,
  deleteUser,
  deleteProfile,
  updatePassword,
} from "../controllers/userController.js";
import { upload } from "../middleware/multer.Middleware.js";
import { authenticated } from "../middleware/authenticatUser.js";
const router = Router();

router.route("/register").post(upload.single("profile"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authenticated, logoutUser);
router.route("/createTokens").post(refreshAccessToken);
router.route("/getUser").get(getUser);
router.route("/updateUser").put(authenticated, updateUser);
router
  .route("/profileUpdate")
  .patch(authenticated, upload.single("profile"), updateProfile);
router.route("/resetPassword").post(resetPassword);
router.route("/deleteUser").delete(authenticated, deleteUser);
router.route("/profileDelete").delete(authenticated,deleteProfile)
router.route("/updatePassword").patch(authenticated, updatePassword);

export default router;
