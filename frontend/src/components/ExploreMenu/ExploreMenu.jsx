import React, { useContext } from "react";
import "./ExploreMenu.css";
import { StoreContext } from "../../Context/StoreContext";

const ExploreMenu = ({ category, setCategory }) => {
  const { menu_list } = useContext(StoreContext);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Our meal plans</h1>
      <p className="explore-menu-text">
        Choose chef-crafted recipes with pre-portioned organic
        ingredients—delivered to your door. Cook tailored meals (vegan, halal,
        fitness-friendly) in 30 minutes, no prep needed.
      </p>
      <p className="explore-menu-text">
        Our mission: Healthy eating, made effortless for Hong Kong’s busy lives.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                src={item.menu_image}
                className={category === item.menu_name ? "active" : ""}
                alt=""
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
