import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SubscriptionPayment.css";

const SubscriptionPayment = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    agreedToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [planDetails, setPlanDetails] = useState({});

  useEffect(() => {
    // Get the selected plan from localStorage when component mounts
    const plan = localStorage.getItem("selectedPlan");
    if (plan) {
      setSelectedPlan(plan);
    } else {
      // If no plan is found, redirect back to subscription plans
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    // Set plan details based on the selected plan
    const plans = {
      weekly: {
        name: "Weekly Essentials",
        price: 800,
        period: "week",
        meals: "5 meals per week (2 servings each)",
        features: [
          "Fresh, pre-portioned ingredients",
          "Easy-to-follow recipe cards",
          "Weekly delivery schedule",
          "Skip or cancel anytime",
        ],
      },
      monthly: {
        name: "Monthly Standard",
        price: 2880,
        period: "month",
        meals: "20 meals per month (2 servings each)",
        features: [
          "Premium seasonal ingredients",
          "Digital recipe access",
          "Flexible delivery dates",
          "Free Delivery",
        ],
      },
      premium: {
        name: "Premium Chef's Choice",
        price: 3500,
        period: "month",
        meals: "20 meals per month (2 servings each)",
        features: [
          "Premium seasonal ingredients",
          "Digital recipe access",
          "Vote on upcoming recipes",
          "Early access to seasonal menus",
          "Chef's special ingredients",
          "10% off add-ons and extras",
        ],
      },
    };

    if (selectedPlan) {
      setPlanDetails(plans[selectedPlan] || {});
    }
  }, [selectedPlan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to success page
      navigate("/subscription-success");
    }, 1500);
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  return (
    <section className="subscription-payment">
      <div className="container">
        <div className="payment-wrapper">
          <div className="summary-container">
            <h2>Order Summary</h2>
            <div className="plan-summary">
              <h3>{planDetails.name}</h3>
              <p className="plan-price">
                ${planDetails.price} <span>/{planDetails.period}</span>
              </p>
              <div className="plan-details">
                <p className="meals">{planDetails.meals}</p>
                <ul className="plan-features">
                  {planDetails.features &&
                    planDetails.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                </ul>
              </div>
              <div className="total-section">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${planDetails.price}</span>
                </div>
                <div className="total-row">
                  <span>Delivery</span>
                  <span>{selectedPlan === "weekly" ? "$50" : "Free"}</span>
                </div>
                <div className="total-row total">
                  <span>Total</span>
                  <span>
                    $
                    {selectedPlan === "weekly"
                      ? planDetails.price + 50
                      : planDetails.price}
                  </span>
                </div>
              </div>
            </div>
            <p className="guarantee">All prices in HKD.</p>
            <p className="guarantee">100% Satisfaction Guarantee</p>
          </div>

          <div className="payment-form-container">
            <h2>Complete Your Order</h2>
            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Delivery Address</h3>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="district">District</label>
                    <select
                      id="district"
                      name="district"
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select District</option>
                      <option value="central">Central</option>
                      <option value="wanchai">Wan Chai</option>
                      <option value="causeway">Causeway Bay</option>
                      <option value="north">North Point</option>
                      <option value="tsimsha">Tsim Sha Tsui</option>
                      <option value="mongkok">Mong Kok</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setFormData({ ...formData, cardNumber: formatted });
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="agreedToTerms"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreedToTerms">
                  I agree to the <a href="/terms">Terms and Conditions</a> and{" "}
                  <a href="/privacy">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading
                  ? "Processing..."
                  : `Complete Order - $${
                      selectedPlan === "weekly"
                        ? planDetails.price + 50
                        : planDetails.price
                    }`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPayment;
