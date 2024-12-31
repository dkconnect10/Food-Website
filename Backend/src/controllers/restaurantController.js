import Restaurant from "../models/restaurantModel.js";
import User from "../models/userModel.js";

const restaurantRegister = async (req, res) => {
  try {
    const user = await User.findOne(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const {
      title,
      imageUrl,
      foods,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      coords,
    } = req.body;
    if (!title || !coords?.address) {
      return res.status(501).json({
        success: false,
        message: "title and address is required",
      });
    }

    const restaurant = await Restaurant.create({
      title,
      imageUrl,
      foods,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      coords,
    });

    if (!restaurant) {
      return res.status(409).json({
        success: false,
        message: "restaurant model not created",
      });
    }

    return res.status(200).json({
      success: true,
      message: "restaurant model create successfully",
      restaurant,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "something went wrong while register restaurant",
    });
  }
};

const getAllrestaurant = async (req, res) => {
  try {
    const Restaurants = await Restaurant.find({});
    if (!Restaurants) {
      return res.status(501).json({
        success: false,
        message: "Restaurants not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get All Restaurants successfully",
      Restaurant: Restaurants.length,
      Restaurants,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "something went wrong while GetAllRestaurant",
    });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID not provided",
      });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant found successfully",
      restaurant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the restaurant by ID",
    });
  }
};

const deleteRestaurantById = async (req, res) => {
  try {
    const user = await User.findOne(req.user);

    if (!user) {
      return res.status(501).json({
        success: false,
        message: "user not authenticate",
      });
    }
    const restaurantId  = req.params;

    if (!restaurantId) {
      return res.status(501).json({
        success: false,
        message: "send restaurantId properly ",
      });
    }

    const restaurant = await Restaurant.findByIdAndDelete(restaurantId);
    if (!restaurant) {
      return res.status(501).json({
        success: false,
        message: "restaurent not registered in over database",
      });
    }

    return res.status(200).json({
      success: true,
      message: "restaurent Delete successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "somthing went wrong while delete Restaurant",
    });
  }
};

export {
  restaurantRegister,
  getAllrestaurant,
  getRestaurantById,
  deleteRestaurantById,
};
