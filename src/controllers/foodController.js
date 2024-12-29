import { Food } from "../models/foodModel.js";

const createFood = async (req, res) => {
  try {
    const { title, description, price, resturant,foodTags,category,code,isAvailable,rating } = req.body;

    if (!title || !description || !price || !resturant) {
      return res.status(404).json({
        success: false,
        message: "title , description , price and resturant is requie",
      });
    }

    const food = await Food.create({
      title,
      description,
      price,
      resturant,
      foodTags,
      category,
      code,
      isAvailable,
      rating,
    });
    if (!food) {
      return res.status(501).json({
        success: false,
        message: "something went wrong while create food schema",
      });
    }
    return res.status(200).json({
      success: true,
      message: "food create successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "somthing went wrong while create food schema",
    });
  }
};

export { createFood };
