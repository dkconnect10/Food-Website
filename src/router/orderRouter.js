import {authUser} from '../middleware/authMiddleware.js'
import {adminAuth} from '../middleware/adminMiddleware.js'
import { Router } from "express";
import {placeOrderController,updateStatus} from '../controllers/orderController.js'

const router = Router()

router.route("/placed").post(authUser,placeOrderController)
router.route("/update/:id").patch(authUser,adminAuth,updateStatus)

export default router