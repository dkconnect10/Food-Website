import { Food } from "../models/foodModel.js";

const createFood = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      resturant,
      foodTags,
      category,
      code,
      isAvailable,
      rating,
    } = req.body;

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

const getAllFood = async (req, res) => {
  try {
    const food = await Food.find({});
    if (!food) {
      return res.status(501).json({
        success: false,
        message: "No food available in over database",
      });
    }
    return res.status(200).json({
      success: false,
      message: "Food find successfully",
      food,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "somthing went wrong while find All food ",
    });
  }
};

const getFoodbyId = async (req, res) => {
  try {
    const foodId = req.params.id;

    if (!foodId) {
      return res.status(409).json({
        success: false,
        message: "food Id not found",
      });
    }

    const food = await Food.findOne({ foodId });

    if (!food) {
      return res.status(501).json({
        success: false,
        message: "food not found",
      });
    }

    return res.status(200).json({
      success: false,
      message: "food found successfully",
      food,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "somthing went wrong while find user by id ",
    });
  }
};

const updateFood = async (req, res) => {
  try {
    const foodId = req.params.id;
    const {
      title,
      description,
      price,
      resturant,
      foodTags,
      category,
      code,
      isAvailable,
      rating,
    } = req.body;
    if (!foodId) {
      return res.status(404).json({
        success: false,
        message: "Enter valid food id ",
      });
    }
    const food = await Food.findByIdAndUpdate(
      foodId,
      {
        title,
        description,
        price,
        resturant,
        foodTags,
        category,
        code,
        isAvailable,
        rating,
      },
      { new: true }
    );

    if (!food) {
      return res.status(501).json({
        success: false,
        message: "user not updated",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user updated successfully",
      food,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "something went wrong while update Food",
    });
  }
};

const foodByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    if (!restaurantId) {
      return res.status(501).json({
        success: false,
        message: "enter valid restaurant id",
      });
    }

    const food = await Food.find({ restaurant: restaurantId });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "food not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "restaurent find successfully",
      food
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "something went wrong while food find by acording to restaurant",
    });
  }
};

const deteleFood = async (req, res) => {
  try {
    const foodId = req.params.id;
    if (!foodId) {
      return res.status(501).json({
        success: false,
        message: "enter valid food id",
      });
    }
    await Food.findByIdAndDelete(foodId);
    return res.status(200).json({
      success: false,
      message: "food delete successfully ",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "something went wrong while Delete food",
      food,
    });
  }
};

export {
  createFood,
  getAllFood,
  getFoodbyId,
  updateFood,
  deteleFood,
  foodByRestaurant,
  
};
