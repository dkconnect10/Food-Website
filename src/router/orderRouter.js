
import { Router } from "express";
import {placeOrderController,updateStatus} from '../controllers/orderController.js'

const router = Router()

router.route("/placed").post(placeOrderController)
router.route("/update/:id").patch(updateStatus)

export default router