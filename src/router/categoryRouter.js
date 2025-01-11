import { Router } from "express";
import { categoryRegister,findAllCategory,findCategoryById,deleteCategoryById,updateCategory } from "../controllers/categoryController.js";
import {authUser}  from '../middleware/authMiddleware.js'

const router = Router()

router.route("/register").post(authUser,categoryRegister)
router.route("/get").get(findAllCategory)
router.route("/get/:id").get(findCategoryById)
router.route('/delete/:id').delete(deleteCategoryById)
router.route("/update/:id").patch(authUser,updateCategory)


export default router