// backend/controllers/subscriptionController.js
import subscriptionModel from "../models/subscriptionModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Config variables
const currency = "hkd";
const frontend_URL = "http://localhost:5173";

// Get plan details
const getPlanDetails = (plan) => {
  const plans = {
    weekly: {
      name: "Weekly Essentials",
      price: 900,
      period: "week",
      days: 7,
      meals: 5,
      freeDelivery: false,
    },
    monthly: {
      name: "Monthly Standard",
      price: 3240,
      period: "month",
      days: 30,
      meals: 20,
      freeDelivery: true,
    },
    premium: {
      name: "Premium Chef's Choice",
      price: 4000,
      period: "month",
      days: 30,
      meals: 20,
      freeDelivery: true,
    },
  };

  return plans[plan];
};

// Check if user has active subscription
const getActiveSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionModel.findOne({
      userId: req.body.userId,
      active: true,
    });

    if (subscription) {
      return res.json({ success: true, data: subscription });
    } else {
      return res.json({
        success: false,
        message: "No active subscription found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching subscription" });
  }
};

// Purchase subscription
const purchaseSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.body.userId;

    // Check if user already has an active subscription
    const existingSubscription = await subscriptionModel.findOne({
      userId,
      active: true,
    });

    if (existingSubscription) {
      // Prevent downgrade or same plan purchase
      if (
        plan === "weekly" ||
        (plan === "monthly" && existingSubscription.plan === "premium") ||
        plan === existingSubscription.plan
      ) {
        return res.json({
          success: false,
          message: "You cannot purchase a lower or same tier subscription",
        });
      }
    }

    const planDetails = getPlanDetails(plan);

    // Calculate end date based on plan period
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + planDetails.days);

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      success_url: `${frontend_URL}/verify-subscription?success=true&plan=${plan}`,
      cancel_url: `${frontend_URL}/verify-subscription?success=false&plan=${plan}`,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: planDetails.name,
            },
            unit_amount: planDetails.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId,
        plan,
        endDate: endDate.toISOString(),
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error creating subscription" });
  }
};

// Verify and activate subscription
// In verifySubscription function
const verifySubscription = async (req, res) => {
  try {
    const { success, plan } = req.body;
    const userId = req.body.userId;

    console.log("Verifying subscription:", { success, plan, userId });

    if (success === "true") {
      const planDetails = getPlanDetails(plan);

      // Calculate end date
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + planDetails.days);

      // Check for existing subscription
      const existingSubscription = await subscriptionModel.findOne({
        userId,
        active: true,
      });

      if (existingSubscription) {
        console.log("Updating existing subscription");
        // Update existing subscription if upgrading
        existingSubscription.plan = plan;
        existingSubscription.startDate = new Date();
        existingSubscription.endDate = endDate;
        existingSubscription.mealsRemaining = planDetails.meals;
        await existingSubscription.save();
      } else {
        console.log("Creating new subscription");
        // Create new subscription
        const newSubscription = new subscriptionModel({
          userId,
          plan,
          startDate: new Date(),
          endDate,
          mealsRemaining: planDetails.meals,
          active: true,
        });

        await newSubscription.save();
      }

      res.json({ success: true, message: "Subscription activated" });
    } else {
      res.json({ success: false, message: "Subscription payment failed" });
    }
  } catch (error) {
    console.log("Error in verifySubscription:", error);
    res.json({ success: false, message: "Error activating subscription" });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionModel.findOne({
      userId: req.body.userId,
      active: true,
    });

    if (subscription) {
      subscription.active = false;
      subscription.autoRenew = false;
      await subscription.save();
      return res.json({
        success: true,
        message: "Subscription cancelled successfully",
      });
    } else {
      return res.json({
        success: false,
        message: "No active subscription found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error cancelling subscription" });
  }
};

// Use a meal from subscription
const useMeal = async (req, res) => {
  try {
    const subscription = await subscriptionModel.findOne({
      userId: req.body.userId,
      active: true,
    });

    if (!subscription) {
      return res.json({
        success: false,
        message: "No active subscription found",
      });
    }

    if (subscription.mealsRemaining <= 0) {
      return res.json({
        success: false,
        message: "No meals remaining in your plan",
      });
    }

    subscription.mealsRemaining -= 1;
    await subscription.save();

    return res.json({
      success: true,
      message: "Meal used successfully",
      mealsRemaining: subscription.mealsRemaining,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error using meal" });
  }
};

export {
  getActiveSubscription,
  purchaseSubscription,
  verifySubscription,
  cancelSubscription,
  useMeal,
  getPlanDetails,
};
