import {authUser} from '../middleware/authMiddleware.js'
import { Router } from "express";
import {createOrder} from '../controllers/orderController.js'

const router = Router()

router.route("/create").post(authUser,createOrder)

export default router