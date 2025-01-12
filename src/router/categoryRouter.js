import { Router } from "express";
import { categoryRegister,findAllCategory,findCategoryById,deleteCategoryById,updateCategory } from "../controllers/categoryController.js";


const router = Router()

router.route("/register").post(categoryRegister)
router.route("/get").get(findAllCategory)
router.route("/get/:id").get(findCategoryById)
router.route('/delete/:id').delete(deleteCategoryById)
router.route("/update/:id").patch(updateCategory)


export default router