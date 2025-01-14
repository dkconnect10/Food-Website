import { Router } from "express";
import { categoryRegister,findAllCategory,findCategoryById,deleteCategoryById,updateCategory,findFoodByCategory } from "../controllers/categoryController.js";
import {authenticated} from '../middleware/authenticatUser.js'

const router = Router()

router.route("/register").post(authenticated,categoryRegister)
router.route("/get").get(findAllCategory)
router.route("/get/:id").get(findCategoryById)
router.route('/delete/:id').delete(deleteCategoryById)
router.route("/update/:id").patch(updateCategory)
router.route("/getAllFood/:title").get(findFoodByCategory)


export default router