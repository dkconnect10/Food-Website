import { Router } from "express";
import {createFood,getAllFood ,getFoodbyId,updateFood,deteleFood,foodByRestaurant} from '../controllers/foodController.js'

const router = Router()

router.route("/create").post(createFood)
router.route("/allFood").get(getAllFood)
router.route("/getFood/:id").get(getFoodbyId)
router.route("/updateFood/:id").patch(updateFood)
router.route("/deleteFood/:id").delete(deteleFood)
router.route("/restFood/:id").get(foodByRestaurant)

export default router