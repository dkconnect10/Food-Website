import { Router } from "express";
import {createFood} from '../controllers/foodController.js'

const router = Router()

router.route("/create").post(createFood)

export default router