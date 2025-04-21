import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import subscriptionModel from "../models/subscriptionModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = "http://localhost:5173";

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
  try {
    // Check if user has an active subscription
    const subscription = await subscriptionModel.findOne({
      userId: req.body.userId,
      active: true,
    });

    // Check if order is using subscription meals
    let useSubscription = req.body.useSubscription;
    let freeDelivery = false;

    if (subscription) {
      // Check if the subscription offers free delivery
      if (subscription.plan === "monthly" || subscription.plan === "premium") {
        freeDelivery = true;
      }

      // If using subscription meals, check if there are enough meals left
      if (useSubscription) {
        const totalItemQuantity = req.body.items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        if (subscription.mealsRemaining < totalItemQuantity) {
          return res.json({
            success: false,
            message: `Not enough meals remaining in your subscription. You have ${subscription.mealsRemaining} meals left.`,
          });
        }

        // Deduct meals from subscription
        subscription.mealsRemaining -= totalItemQuantity;
        await subscription.save();
      }
    }

    // Set delivery charge based on subscription status
    let orderAmount = req.body.amount;
    if (freeDelivery) {
      orderAmount -= deliveryCharge; // Remove delivery charge from total
    }
    orderAmount = Math.max(0, orderAmount);
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: orderAmount,
      address: req.body.address,
      usedSubscription: useSubscription || false,
    });

    await newOrder.save();

    if (!useSubscription) {
      await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

      const line_items = req.body.items.map((item) => ({
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      // Add delivery charge if not free
      if (!freeDelivery) {
        line_items.push({
          price_data: {
            currency: currency,
            product_data: {
              name: "Delivery Charge",
            },
            unit_amount: deliveryCharge * 100,
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
        line_items: line_items,
        mode: "payment",
      });

      res.json({ success: true, session_url: session.url });
    } else {
      // If using subscription, payment is already covered
      newOrder.payment = true;
      await newOrder.save();
      await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
      res.json({
        success: true,
        message: "Order placed using your subscription",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Placing User Order for Frontend using stripe
const placeOrderCod = async (req, res) => {
  try {
    // Check if user has an active subscription
    const subscription = await subscriptionModel.findOne({
      userId: req.body.userId,
      active: true,
    });

    // Check if order is using subscription meals
    let useSubscription = req.body.useSubscription;
    let freeDelivery = false;

    if (subscription) {
      // Check if the subscription offers free delivery
      if (subscription.plan === "monthly" || subscription.plan === "premium") {
        freeDelivery = true;
      }

      // If using subscription meals, check if there are enough meals left
      if (useSubscription) {
        const totalItemQuantity = req.body.items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        if (subscription.mealsRemaining < totalItemQuantity) {
          return res.json({
            success: false,
            message: `Not enough meals remaining in your subscription. You have ${subscription.mealsRemaining} meals left.`,
          });
        }

        // Deduct meals from subscription
        subscription.mealsRemaining -= totalItemQuantity;
        await subscription.save();
      }
    }

    // Set delivery charge based on subscription status
    let orderAmount = req.body.amount;
    if (freeDelivery) {
      orderAmount -= deliveryCharge; // Remove delivery charge from total
    }
    orderAmount = Math.max(0, orderAmount);
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: orderAmount,
      address: req.body.address,
      payment: true,
      usedSubscription: useSubscription || false,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  console.log(req.body);
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    res.json({ success: false, message: "Not  Verified" });
  }
};

export {
  placeOrder,
  listOrders,
  userOrders,
  updateStatus,
  verifyOrder,
  placeOrderCod,
};
