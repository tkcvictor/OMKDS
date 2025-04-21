import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";
import "./MyPlan.css";
import { useNavigate } from "react-router-dom";

const MyPlan = () => {
  const { token, url } = useContext(StoreContext);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/api/subscription/get`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setSubscription(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm("Are you sure you want to cancel your subscription?")) {
      try {
        const response = await axios.post(
          `${url}/api/subscription/cancel`,
          {},
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success("Subscription cancelled successfully");
          await fetchSubscription();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Error cancelling subscription");
      }
    }
  };

  const navigateToSubscriptionPlans = () => {
    // Navigate to home page
    navigate("/");

    // After navigation, scroll to the subscription plan section
    setTimeout(() => {
      const subscriptionSection = document.getElementById("subscription-plan");
      if (subscriptionSection) {
        subscriptionSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Small timeout to ensure navigation completes first
  };

  const getPlanDetails = (planName) => {
    const plans = {
      weekly: {
        name: "Weekly Essentials",
        price: 900,
        period: "week",
        totalMeals: 5,
        freeDelivery: false,
      },
      monthly: {
        name: "Monthly Standard",
        price: 3240,
        period: "month",
        totalMeals: 20,
        freeDelivery: true,
      },
      premium: {
        name: "Premium Chef's Choice",
        price: 4000,
        period: "month",
        totalMeals: 20,
        freeDelivery: true,
      },
    };

    return plans[planName] || {};
  };

  if (loading) {
    return (
      <div className="my-plan-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="my-plan-page my-plan-no-subscription">
        <h2>My Plan</h2>
        <div className="my-plan-no-subscription-message">
          <p>Please login to view your subscription details.</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="my-plan-page my-plan-no-subscription">
        <h2>My Plan</h2>
        <div className="my-plan-no-subscription-message">
          <p>You don't have an active subscription yet.</p>
          <p>
            Explore our meal plans and enjoy chef-crafted recipes with
            pre-portioned ingredients delivered to your door.
          </p>
          <button
            onClick={navigateToSubscriptionPlans}
            className="my-plan-subscription-cta"
          >
            View Available Plans
          </button>
        </div>
      </div>
    );
  }

  const planDetails = getPlanDetails(subscription.plan);
  const startDate = new Date(subscription.startDate);
  const endDate = new Date(subscription.endDate);
  const nextBillingDate = new Date(endDate);
  nextBillingDate.setDate(nextBillingDate.getDate() + 1);

  // Calculate percentage of meals used
  const mealsUsed = planDetails.totalMeals - subscription.mealsRemaining;
  const mealsUsedPercentage = (mealsUsed / planDetails.totalMeals) * 100;

  return (
    <div className="my-plan-page">
      <h2>My Subscription Plan</h2>

      <div className="my-plan-summary-card">
        <div className="my-plan-card-header">
          <h3>{planDetails.name}</h3>
          <span className="my-plan-price">
            ${planDetails.price}/{planDetails.period}
          </span>
        </div>

        <div className="my-plan-details">
          <div className="my-plan-detail-item">
            <span>Status:</span>
            <span className="my-plan-active-status">Active</span>
          </div>

          <div className="my-plan-detail-item">
            <span>Start Date:</span>
            <span>{startDate.toLocaleDateString()}</span>
          </div>

          <div className="my-plan-detail-item">
            <span>End Date:</span>
            <span>{endDate.toLocaleDateString()}</span>
          </div>

          <div className="my-plan-detail-item">
            <span>Next Billing:</span>
            <span>{nextBillingDate.toLocaleDateString()}</span>
          </div>

          <div className="my-plan-detail-item">
            <span>Free Delivery:</span>
            <span>{planDetails.freeDelivery ? "Yes" : "No"}</span>
          </div>
        </div>

        <div className="my-plan-meals-progress-section">
          <div className="my-plan-meals-header">
            <h4>Meals Usage</h4>
            <span>
              {subscription.mealsRemaining} of {planDetails.totalMeals}{" "}
              remaining
            </span>
          </div>

          <div className="my-plan-progress-bar-container">
            <div
              className="my-plan-progress-bar-fill"
              style={{ width: `${mealsUsedPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="my-plan-actions">
          <button
            className="my-plan-cancel-btn"
            onClick={handleCancelSubscription}
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPlan;
