import {authUser} from '../middleware/authMiddleware.js'
import { Router } from "express";
import {placeOrderController} from '../controllers/orderController.js'

const router = Router()

router.route("/placed").post(authUser,placeOrderController)

export default router