import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios"; // Add this import for axios
import { toast } from "react-toastify"; // Add this import for toast

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken, url } = useContext(StoreContext); // Added url from context
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const checkPendingSubscription = () => {
    const pendingSubscription = localStorage.getItem("pendingSubscription");
    if (pendingSubscription && token) {
      // Clear the pending subscription from localStorage
      localStorage.removeItem("pendingSubscription");
      // Navigate to subscription page or directly handle subscription
      handleSubscription(pendingSubscription);
    }
  };

  const handleSubscription = async (plan) => {
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

  useEffect(() => {
    if (token) {
      checkPendingSubscription();
    }
  }, [token]);

  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src={assets.logo} alt="" />
      </Link>
      {/*<Link to='/'><p className='title'>Foodzip</p></Link>*/}
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={`${menu === "home" ? "active" : ""}`}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={`${menu === "menu" ? "active" : ""}`}
        >
          Menu
        </a>
        <a
          href="#subscription-plan"
          onClick={() => setMenu("plan")}
          className={`${menu === "plan" ? "active" : ""}`}
        >
          Meal Plan
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mob-app")}
          className={`${menu === "mob-app" ? "active" : ""}`}
        >
          Mobile app
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact")}
          className={`${menu === "contact" ? "active" : ""}`}
        >
          Contact us
        </a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <Link to="/cart" className="navbar-search-icon">
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="navbar-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" /> <p>Orders</p>
              </li>
              <li onClick={() => navigate("/my-plan")}>
                <img src={assets.order_icon} alt="" /> <p>My Plan</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" /> <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
