import Restaurant from "../models/restaurantModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Category from "../models/categoryModel.js";

// Register Restaurant
const restaurantRegister = asyncHandler(async (req, res) => {
  // Check if the user is present in req.user (passed from middleware)
  const user = req.user;

  if (!user) {
    throw new ApiError(404, "User not found");
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
    throw new ApiError(400, "Title and address are required");
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
    throw new ApiError(409, "Restaurant not created");
  }

  if (user.userType !== "admin") {
    user.userType = "vendor";
    user.save();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, restaurant, "Restaurant registered successfully")
    );
});

// Get All Restaurants
const getAllrestaurant = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({});

  if (!restaurants || restaurants.length === 0) {
    throw new ApiError(404, "No restaurants found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { restaurantsCount: restaurants.length, restaurants },
        "Restaurants fetched successfully"
      )
    );
});

// Get Restaurant by ID
const getRestaurantById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    throw new ApiError(400, "Restaurant ID not provided");
  }

  const restaurant = await Restaurant.findById(id);

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, restaurant, "Restaurant found successfully"));
});

// Delete Restaurant by ID
const deleteRestaurantById = asyncHandler(async (req, res) => {
  // No need to find the user again, as it is already added in req.user from middleware
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  const restaurantId = req.params.id; // Corrected

  if (!restaurantId) {
    throw new ApiError(400, "Restaurant ID not provided");
  }

  const restaurant = await Restaurant.findByIdAndDelete(restaurantId);

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found in the database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Restaurant deleted successfully"));
});

// Get All category
const getAllCategory = asyncHandler(async (req, res) => {
  const category = await Restaurant.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "restaurantId",
        as: "categories",
      },
    },
    {
      $project:{
        title: 1, 
        "categories.title": 1, 
        "categories._id": 1,
      }
    }
  ]);

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Get All category successfully"));
});

export {
  restaurantRegister,
  getAllrestaurant,
  getRestaurantById,
  deleteRestaurantById,
  getAllCategory,
};
