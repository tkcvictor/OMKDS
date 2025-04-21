// backend/routes/subscriptionRoute.js
import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getActiveSubscription,
  purchaseSubscription,
  verifySubscription,
  cancelSubscription,
  useMeal,
} from "../controllers/subscriptionController.js";

const subscriptionRouter = express.Router();

subscriptionRouter.post("/get", authMiddleware, getActiveSubscription);
subscriptionRouter.post("/purchase", authMiddleware, purchaseSubscription);
subscriptionRouter.post("/verify", authMiddleware, verifySubscription);
subscriptionRouter.post("/cancel", authMiddleware, cancelSubscription);
subscriptionRouter.post("/use-meal", authMiddleware, useMeal);

export default subscriptionRouter;
