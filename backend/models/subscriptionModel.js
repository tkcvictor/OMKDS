import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  plan: {
    type: String,
    required: true,
    enum: ["weekly", "monthly", "premium"],
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  autoRenew: { type: Boolean, default: true },
  mealsRemaining: { type: Number, required: true },
  active: { type: Boolean, default: true },
});

const subscriptionModel =
  mongoose.models.subscription ||
  mongoose.model("subscription", subscriptionSchema);
export default subscriptionModel;
