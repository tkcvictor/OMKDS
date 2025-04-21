import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [payment, setPayment] = useState("cod");
  const location = useLocation();
  const useSubscription = location.state?.useSubscription || false;
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    setCartItems,
    currency,
    deliveryCharge,
    subscription, // Make sure this is properly destructured from context
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  // Calculate total amount based on subscription status
  const calculateTotalAmount = () => {
    // If using subscription, only charge delivery for weekly plan
    if (useSubscription) {
      // For subscription orders, return either 0 (free delivery) or just the delivery charge
      return subscription &&
        (subscription.plan === "monthly" || subscription.plan === "premium")
        ? 0 // Free delivery
        : deliveryCharge; // Only pay delivery charge
    }

    // Regular pricing calculation - ensure we never return a negative value
    const totalAmount =
      getTotalCartAmount() +
      (subscription &&
      (subscription.plan === "monthly" || subscription.plan === "premium")
        ? 0
        : deliveryCharge);

    return Math.max(0, totalAmount); // Ensure we never return a negative value
  };

  // Calculate total items in cart
  const calculateTotalItems = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo.quantity = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    const totalItems = calculateTotalItems();

    // If using subscription, check if enough meals remaining
    if (useSubscription && subscription) {
      if (subscription.mealsRemaining < totalItems) {
        toast.error(
          `Not enough meals in your subscription. You have ${subscription.mealsRemaining} meals remaining.`
        );
        return;
      }
    }

    let orderData = {
      address: data,
      items: orderItems,
      amount: calculateTotalAmount(),
      useSubscription: useSubscription,
    };

    try {
      let response;

      // For subscription orders or COD, place order directly
      if (useSubscription) {
        response = await axios.post(url + "/api/order/place", orderData, {
          headers: { token },
        });

        if (response.data.success) {
          toast.success("Order placed using your subscription!");
          setCartItems({});
          navigate("/myorders");
        } else {
          toast.error(response.data.message || "Error placing order");
        }
      } else if (payment === "cod") {
        response = await axios.post(url + "/api/order/placecod", orderData, {
          headers: { token },
        });

        if (response.data.success) {
          toast.success("Order placed with Cash on Delivery!");
          setCartItems({});
          navigate("/myorders");
        } else {
          toast.error(response.data.message || "Error placing order");
        }
      } else {
        // For Stripe payment
        response = await axios.post(url + "/api/order/place", orderData, {
          headers: { token },
        });

        if (response.data.success) {
          const { session_url } = response.data;
          window.location.replace(session_url);
        } else {
          toast.error(
            response.data.message || "Error creating payment session"
          );
        }
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Error placing order. Please try again.");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to place an order");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-field">
          <input
            type="text"
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="First name"
            required
          />
          <input
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder="Last name"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          placeholder="Email address"
          required
        />
        <input
          type="text"
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          placeholder="Street"
          required
        />
        <div className="multi-field">
          <input
            type="text"
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            placeholder="State"
            required
          />
        </div>
        <div className="multi-field">
          <input
            type="text"
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            placeholder="Zip code"
            required
          />
          <input
            type="text"
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            placeholder="Country"
            required
          />
        </div>
        <input
          type="text"
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          placeholder="Phone"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Order Summary</h2>
          <div>
            <div className="cart-total-details">
              <p>Items</p>
              <p>{calculateTotalItems()}</p>
            </div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>
                {currency}
                {useSubscription ? 0 : getTotalCartAmount()}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>
                {subscription &&
                (subscription.plan === "monthly" ||
                  subscription.plan === "premium")
                  ? "Free"
                  : `${currency}${deliveryCharge}`}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {currency}
                {calculateTotalAmount()}
              </b>
            </div>

            {useSubscription && subscription && (
              <div className="cart-total-details subscription-info">
                <p>Subscription Meals Remaining</p>
                <p>
                  {subscription.mealsRemaining - calculateTotalItems()} (after
                  order)
                </p>
              </div>
            )}
          </div>
        </div>

        {useSubscription ? (
          <button className="place-order-submit" type="submit">
            Place Order Using Subscription
          </button>
        ) : (
          <>
            <div className="payment">
              <h2>Payment Method</h2>
              <div onClick={() => setPayment("cod")} className="payment-option">
                <img
                  src={payment === "cod" ? assets.checked : assets.un_checked}
                  alt=""
                />
                <p>COD (Cash on delivery)</p>
              </div>
              <div
                onClick={() => setPayment("stripe")}
                className="payment-option"
              >
                <img
                  src={
                    payment === "stripe" ? assets.checked : assets.un_checked
                  }
                  alt=""
                />
                <p>Stripe (Credit / Debit)</p>
              </div>
            </div>
            <button className="place-order-submit" type="submit">
              {payment === "cod" ? "Place Order" : "Proceed To Payment"}
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default PlaceOrder;
