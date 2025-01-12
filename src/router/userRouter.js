import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  resetPassword,
  deleteUser,
  updatePassword,
} from "../controllers/userController.js";

import { upload } from "../middleware/multer.Middleware.js";

import {authenticated} from '../middleware/authenticatUser.js'
const router = Router();

// router.route("/register").post(upload.single("profile"), registerUser);


router.route("/register").post(upload.single("profile"),registerUser)

router.route("/login").post(loginUser);
router.route("/logout").post(authenticated , logoutUser)
router.route("/getUser").get(getUser);
router.route("/updateUser").put( updateUser);
router.route("/resetPassword").post(resetPassword);
router.route("/deleteUser").delete( deleteUser);
router.route("/updatePassword").patch( updatePassword);

export default router;
