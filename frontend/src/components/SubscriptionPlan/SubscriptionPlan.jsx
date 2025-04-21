// frontend/src/components/SubscriptionPlan/SubscriptionPlan.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SubscriptionPlan.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const SubscriptionPlan = () => {
  const navigate = useNavigate();
  const { token, url } = useContext(StoreContext);
  const [subscription, setSubscription] = useState(null);

  const fetchSubscription = async () => {
    try {
      const response = await axios.post(
        `${url}/api/subscription/get`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setSubscription(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const handleSubscription = async (plan) => {
    if (!token) {
      toast.error("Please login to subscribe to a meal plan");
      // Save the plan in localStorage to redirect after login
      localStorage.setItem("pendingSubscription", plan);
      return;
    }

    useEffect(() => {
      if (token) {
        fetchSubscription();
      }
    }, [token]);

    // Check if user is trying to downgrade
    if (subscription) {
      if (
        plan === "weekly" ||
        (plan === "monthly" && subscription.plan === "premium") ||
        plan === subscription.plan
      ) {
        toast.error("You cannot purchase a lower or same tier subscription");
        return;
      }
    }

    try {
      const response = await axios.post(
        `${url}/api/subscription/purchase`,
        { plan },
        { headers: { token } }
      );

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error processing subscription");
    }
  };

  return (
    <section className="subscription-section" id="subscription-plan">
      <div className="container">
        <h2>Choose Your Meal Plan</h2>
        <p className="subtitle">Fresh ingredients delivered to your doorstep</p>

        {subscription && (
          <div className="current-plan-banner">
            <p>
              You're currently subscribed to the{" "}
              <strong>
                {subscription.plan.charAt(0).toUpperCase() +
                  subscription.plan.slice(1)}
              </strong>{" "}
              plan with <strong>{subscription.mealsRemaining}</strong> meals
              remaining. <a href="/my-plan">View details</a>
            </p>
          </div>
        )}

        <div className="plans-container">
          <div className="plan-card">
            <div className="plan-header">
              <h3>Weekly Essentials</h3>
              <p className="price">
                $500<span>/week</span>
              </p>
            </div>
            <ul className="features">
              <li>5 meals per week</li>
              <li>Fresh, pre-portioned ingredients</li>
              <li>Easy-to-follow recipe cards</li>
              <li>Weekly delivery schedule</li>
              <li>Skip or cancel anytime</li>
            </ul>
            <button
              className="select-plan-btn"
              onClick={() => handleSubscription("weekly")}
            >
              Get Started
            </button>
          </div>

          <div className="plan-card popular">
            <div className="popular-tag">Most Popular</div>
            <div className="plan-header">
              <h3>Monthly Standard</h3>
              <p className="price">
                $1,900<span>/month</span>
              </p>
              <p className="savings">Save 5% more vs. weekly</p>
            </div>
            <ul className="features">
              <li>20 meals per month</li>
              <li>Everything from the previous tier</li>
              <li>Premium seasonal ingredients</li>
              <li>Digital recipe access</li>
              <li>Flexible delivery dates</li>
              <li>Free Delivery</li>
            </ul>
            <button
              className="select-plan-btn"
              onClick={() => handleSubscription("monthly")}
            >
              Get Started
            </button>
          </div>

          <div className="plan-card premium">
            <div className="plan-header">
              <h3>Premium Chef's Choice</h3>
              <p className="price">
                $3,000<span>/month</span>
              </p>
            </div>
            <ul className="features">
              <li>25 meals per month</li>
              <li>Everything from the previous tier</li>
              <li>Premium seasonal ingredients</li>
              <li>Vote on upcoming recipes</li>
              <li>Early access to seasonal menus</li>
              <li>Chef's special ingredients</li>
              <li>10% off add-ons and extras</li>
            </ul>
            <button
              className="select-plan-btn"
              onClick={() => handleSubscription("premium")}
            >
              Get Started
            </button>
          </div>
        </div>

        <p className="guarantee">All prices in HKD.</p>
        <p className="guarantee">
          100% Satisfaction Guarantee. No commitment required.
        </p>
      </div>
    </section>
  );
};

export default SubscriptionPlan;
