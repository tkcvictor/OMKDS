import React, { useRef } from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>From Box to Plate, Perfection in 30</h2>
        <p>
          Whether you’re vegan, gluten-free, halal, or fueling your fitness
          goals, our chef-crafted meals are designed for your needs. Every kit
          includes:
        </p>
        <list>
          <ul>✅ Pre-measured ingredients.</ul>
          <ul>✅ Easy-to-follow recipes (no chef skills required!).</ul>
          <ul>
            ✅ Diet-specific options: vegan, diabetic-friendly, halal, and more.
          </ul>
          <ul>✅ Eco-friendly packaging that cares for Hong Kong’s future.</ul>
        </list>
        <button>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
