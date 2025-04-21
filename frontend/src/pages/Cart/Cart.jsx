import React, { useContext, useState } from "react";
import "./Cart.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    currency,
    deliveryCharge,
    token,
    subscription,
  } = useContext(StoreContext);
  const [useSubscription, setUseSubscription] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p>{" "}
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>
                    {currency}
                    {item.price}
                  </p>
                  <div>{cartItems[item._id]}</div>
                  <p>
                    {currency}
                    {item.price * cartItems[item._id]}
                  </p>
                  <p
                    className="cart-items-remove-icon"
                    onClick={() => removeFromCart(item._id)}
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null; // Add this return for the map function
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            {cartItems &&
              Object.keys(cartItems).length > 0 &&
              token &&
              subscription &&
              subscription.mealsRemaining > 0 && (
                <div className="cart-subscription-option">
                  <div
                    className="subscription-checkbox"
                    onClick={() => setUseSubscription(!useSubscription)}
                  >
                    <img
                      src={useSubscription ? assets.checked : assets.un_checked}
                      alt=""
                    />
                    <p>
                      Use my subscription ({subscription.mealsRemaining} meals
                      left)
                    </p>
                  </div>
                  {useSubscription && (
                    <div className="subscription-message">
                      <p>
                        You'll use{" "}
                        {Object.values(cartItems).reduce((a, b) => a + b, 0)}{" "}
                        meals from your subscription.
                      </p>
                    </div>
                  )}
                </div>
              )}
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>
                {currency}
                {getTotalCartAmount()}
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
                  : `${currency}${
                      getTotalCartAmount() === 0 ? 0 : deliveryCharge
                    }`}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {currency}
                {useSubscription
                  ? subscription &&
                    (subscription.plan === "monthly" ||
                      subscription.plan === "premium")
                    ? 0 // Free delivery with premium/monthly plans
                    : deliveryCharge // Only pay delivery charge with weekly plan
                  : getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() +
                    (subscription &&
                    (subscription.plan === "monthly" ||
                      subscription.plan === "premium")
                      ? 0
                      : deliveryCharge)}
              </b>
            </div>
          </div>
          <button
            onClick={() => {
              if (!token) {
                toast.error("Please login to proceed");
                return;
              }
              navigate("/order", { state: { useSubscription } });
            }}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
