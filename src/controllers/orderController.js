import { Order } from "../models/orderModel.js";

const createOrder = async (req, res) => {
  try {
    const { cart} = req.body;
    if (!cart) {
      return res.status(501).json({
        success: false,
        message: "enter proper cart details",
      });
    }
    let total = 0;

    cart.map((i) => {
      total += i.price
    });

    const totalOrder = await Order.create({
      food: cart,
      payment: total,
      buyer: req.user,
    });

    if (!totalOrder) {
      return res.status(501).json({
        success: false,
        message: "somthing went wrong while createing order",
      });
    }

    return res.status(200).json({
      success: true,
      message: "order placed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "somthing went wrong while odring food",
      error,
    });
  }
};

export { createOrder };
