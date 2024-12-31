import Category from "../models/categoryModel.js";

const categoryRegister = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;

    if (!title) {
      return res.status(409).json({
        success: false,
        message: "enter title properly",
      });
    }

    const category = await Category.create({
      title,
      imageUrl,
    });

    if (!category) {
      return res.status({
        success: false,
        message: "category not created somthing went wrong ",
      });
    }
    return res.status(200).json({
      success: true,
      message: "category registerd successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "something went wrong while register category",
    });
  }
};

const findAllCategory = async (req, res) => {
  try {
    const categroys = await Category.find({});
    return res.status(200).json({
      success: false,
      message: "category find successfully",
      categroyCount: categroys.length,
      categroys,
    });
  } catch (error) {
    console.log(error);
    return res.status(409).json({
      success: false,
      message: "something went wrong while find all user",
    });
  }
};

const findCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(501).json({
        success: false,
        message: "Please enter category Id",
      });
    }

    const categroy = await Category.find({ categoryId });
    if (!categroy) {
      return res.status(404).json({
        success: false,
        message: "category Not Found",
      });
    }
    return res.status(200).json({
      success: false,
      message: "categroy found successfully",
      categroy,
    });
  } catch (error) {
    console.log(error);
    return res.status(409).json({
      success: false,
      message: "somthing went wrong while find Catergory by Id",
    });
  }
};

const deleteCategroyById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(501).json({
        success: false,
        message: "Enter valid categroy Id",
      });
    }

    const categroy = await Category.findOne(categoryId);

    if (!categroy) {
      return res.status(404).json({
        success: false,
        message: "categroy not found",
      });
    }
    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: "categroy delete successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "something went wrong while delete category",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { title, imageUrl } = req.body;
    if (!categoryId) {
      return res.status(404).json({
        success: false,
        message: "Enter valid category Id ",
      });
    }
    const categroy = await Category.findByIdAndUpdate(categoryId,{title,imageUrl},{new:true});

    if (!categroy) {
      return res.status(501).json({
        success: false,
        message: "category not found",
      });
    }


    // if (title) categroy.title = title;
    // categroy.imageUrl = imageUrl;

    // await categroy.save();

    return res.status(200).json({
      success: false,
      message: "category update successfully",
      categroy,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "something went wrong while update Catregroy",
    });
  }
};

export {
  categoryRegister,
  findAllCategory,
  findCategoryById,
  deleteCategroyById,
  updateCategory,
};
