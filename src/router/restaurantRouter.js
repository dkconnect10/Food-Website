import { Router } from "express";
import {authenticated} from '../middleware/authenticatUser.js'
import {authAdmin} from '../middleware/admin.middleware.js'

import {restaurantRegister,getAllrestaurant,getRestaurantById, deleteRestaurantById} from '../controllers/restaurantController.js'

const router = Router()


router.route("/registerrestaurant").post(authenticated , restaurantRegister)
router.route("/getAllrestaurant").get(authenticated ,getAllrestaurant)
router.route("/getRestaurantById/:id").get(getRestaurantById)
router.route("/deleteResaurant/:id").delete( authenticated , authAdmin , deleteRestaurantById)


export default router