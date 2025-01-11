import Category from "../models/categoryModel.js";
import {ApiResponse} from '../utils/ApiResponse.js'
import { ApiError } from "../utils/ApiError.js";  
import { asyncHandler } from "../utils/AsyncHandler.js";

// Register category
const categoryRegister = asyncHandler(async (req, res) => {
  const { title, imageUrl } = req.body;

  // Input validation
  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  // Create category
  const category = await Category.create({
    title,
    imageUrl,
  });

  if (!category) {
    throw new ApiError(500, "Error creating category");
  }

  return res.status(201).json(new ApiResponse(201, category, "Category registered successfully"));
});

// Get all categories
const findAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find({});

  return res.status(200).json(new ApiResponse(200, categories, "Categories found successfully", { categoryCount: categories.length }));
});

// Find category by ID
const findCategoryById = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  // Input validation
  if (!categoryId) {
    throw new ApiError(400, "Category ID is required");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res.status(200).json(new ApiResponse(200, category, "Category found successfully"));
});

// Delete category by ID
const deleteCategoryById = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  // Input validation
  if (!categoryId) {
    throw new ApiError(400, "Category ID is required");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await Category.findByIdAndDelete(categoryId);

  return res.status(200).json(new ApiResponse(200, null, "Category deleted successfully"));
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const { title, imageUrl } = req.body;

  // Input validation
  if (!categoryId) {
    throw new ApiError(400, "Category ID is required");
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    { title, imageUrl },
    { new: true }
  );

  if (!category) {
    throw new ApiError(404, "Category not found or update failed");
  }

  return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
});

export {
  categoryRegister,
  findAllCategory,
  findCategoryById,
  deleteCategoryById,
  updateCategory,
};
