import { Router } from "express";
import { registerUser, loginUser, getUser,updateUser,resetPassword,deleteUser,updatePassword} from "../controllers/userController.js";
import { authUser } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getUser").get(authUser, getUser);
router.route("/updateUser").put(authUser,updateUser)
router.route("/resetPassword").post(resetPassword)
router.route("/deleteUser").delete(authUser,deleteUser)
router.route("/updatePassword").patch(authUser,updatePassword)

export default router;
