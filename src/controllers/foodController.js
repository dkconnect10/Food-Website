import { Food } from "../models/foodModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";  // Import ApiResponse class
import { ApiError } from "../utils/ApiError.js";  // Import ApiError class
import { asyncHandler } from "../utils/AsyncHandler.js";

const createFood = asyncHandler(async (req, res) => {
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

  // Input validation
  if (!title || !description || !price || !resturant) {
    throw new ApiError(400, "Title, description, price, and restaurant are required");
  }

  // Create food item
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
    throw new ApiError(500, "Error creating food item");
  }

  return res.status(201).json(new ApiResponse(201, food, "Food created successfully"));
});

const getAllFood = asyncHandler(async (req, res) => {
  const foods = await Food.find({});
  
  if (!foods || foods.length === 0) {
    throw new ApiError(404, "No food available in the database");
  }

  return res.status(200).json(new ApiResponse(200, foods, "Foods retrieved successfully"));
});

const getFoodById = asyncHandler(async (req, res) => {
  const foodId = req.params.id;

  // Input validation
  if (!foodId) {
    throw new ApiError(400, "Food ID is required");
  }

  const food = await Food.findById(foodId);

  if (!food) {
    throw new ApiError(404, "Food not found");
  }

  return res.status(200).json(new ApiResponse(200, food, "Food found successfully"));
});

const updateFood = asyncHandler(async (req, res) => {
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

  // Input validation
  if (!foodId) {
    throw new ApiError(400, "Food ID is required");
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
    throw new ApiError(404, "Food not found or update failed");
  }

  return res.status(200).json(new ApiResponse(200, food, "Food updated successfully"));
});

const foodByRestaurant = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;

  // Input validation
  if (!restaurantId) {
    throw new ApiError(400, "Restaurant ID is required");
  }

  const food = await Food.find({ restaurant: restaurantId });

  if (!food || food.length === 0) {
    throw new ApiError(404, "Food not found for the given restaurant");
  }

  return res.status(200).json(new ApiResponse(200, food, "Food retrieved by restaurant successfully"));
});

const deleteFood = asyncHandler(async (req, res) => {
  const foodId = req.params.id;

  // Input validation
  if (!foodId) {
    throw new ApiError(400, "Food ID is required");
  }

  const deletedFood = await Food.findByIdAndDelete(foodId);

  if (!deletedFood) {
    throw new ApiError(404, "Food not found for deletion");
  }

  return res.status(200).json(new ApiResponse(200, null, "Food deleted successfully"));
});

export {
  createFood,
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
  foodByRestaurant,
};
