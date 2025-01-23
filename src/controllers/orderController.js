import { Order } from "../models/orderModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";  // Import ApiResponse class
import { ApiError } from "../utils/ApiError.js";  // Import ApiError class
import { asyncHandler } from "../utils/AsyncHandler.js";

// Place order controller
const placeOrderController = asyncHandler(async(req, res, next) => {
  const { cart } = req.body;

  // Validate cart
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    throw new ApiError(400, "Please provide a valid food cart");
  }

  // Calculate total price
  let total = 0;
  cart.forEach(item => {
    if (!item.price) {
      throw new ApiError(400, "Each cart item must have a price property");
    }
    total += item.price;  // Ensure each cart item has a 'price' property
  });

  // Create new order
  return Order.create({
    foods: cart,
    payment: total,
    buyer: req.user,  // Assuming 'req.user' contains the authenticated user
  })
    .then(newOrder => {
      return res.status(201).json(new ApiResponse(201, newOrder, "Order placed successfully"));
    })
    .catch(error => {
      console.error('Error in placeOrderController:', error);
      return next(error);  // Pass error to the next middleware (for global error handling)
    });
});

// Update order status controller
const updateStatus = asyncHandler((req, res, next) => {
  const orderId = req.params.id;

  // Validate orderId
  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  const { status } = req.body;

  // Validate status
  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  // Update order status
  return Order.findByIdAndUpdate(orderId, { status }, { new: true })
    .then(order => {
      if (!order) {
        throw new ApiError(404, "Order not found");
      }
      return res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
    })
    .catch(error => {
      console.error('Error in updateStatus:', error);
      return next(error);  // Pass error to the next middleware (for global error handling)
    });
});

export { placeOrderController, updateStatus };
