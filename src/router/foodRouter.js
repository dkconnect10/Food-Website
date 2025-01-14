import { Router } from "express";
import {createFood,getAllFood ,getFoodById,updateFood,deleteFood,foodByRestaurant,getAllFoodsWithCategory} from '../controllers/foodController.js'

const router = Router()

router.route("/create").post(createFood)
router.route("/allFood").get(getAllFood)
router.route("/getFood/:id").get(getFoodById)
router.route("/updateFood/:id").patch(updateFood)
router.route("/deleteFood/:id").delete(deleteFood)
router.route("/restFood/:id").get(foodByRestaurant)
router.route("/foodType/:title").get(getAllFoodsWithCategory);

export default router