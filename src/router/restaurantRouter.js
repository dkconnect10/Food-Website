import { Router } from "express";

import {restaurantRegister,getAllrestaurant,getRestaurantById, deleteRestaurantById} from '../controllers/restaurantController.js'

const router = Router()


router.route("/registerrestaurant").post(restaurantRegister)
router.route("/getAllrestaurant").get(getAllrestaurant)
router.route("/getRestaurantById/:id").get(getRestaurantById)
router.route("/deleteResaurant/:id").delete( deleteRestaurantById)


export default router