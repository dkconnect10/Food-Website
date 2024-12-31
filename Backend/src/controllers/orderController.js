import { Order } from "../models/orderModel.js";

const placeOrderController = async (req, res) => {
  try {
    const { cart } = req.body;
    if (!cart) {
      return res.status(500).send({
        success: false,
        message: "please food cart or payemnt method",
      });
    }
    let total = 0;
    //cal
    cart.map((i) => {
      total += i.price;
    });

    const newOrder = await Order.create({
      foods: cart,
      payment: total,
      buyer: req.user,
    });

    res.status(201).send({
      success: true,
      message: "Order Placed successfully",
      newOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr In Place Order API",
      error,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const orderId = req.params.id
    if (!orderId) {
      return res.status(501).json({
        success: false,
        message: "orderId  not recived",
      });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(501).json({
        success: false,
        message: "status not updated",
      });
    }
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(501).json({
        success: false,
        message: "error found when status update",
      });
    }

    return res.status(200).json({
      success: false,
      message: "user status update successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "somthing went wrong while update status",
    });
  }
};

export { placeOrderController,updateStatus };
