import { Router } from "express";
import { authUser } from "../middleware/authMiddleware.js";
import {restaurantRegister,getAllrestaurant,getRestaurantById, deleteRestaurantById} from '../controllers/restaurantController.js'

const router = Router()


router.route("/registerrestaurant").post(authUser,restaurantRegister)
router.route("/getAllrestaurant").get(getAllrestaurant)
router.route("/getRestaurantById/:id").get(getRestaurantById)
router.route("/deleteResaurant/:id").delete(authUser, deleteRestaurantById)


export default router