import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <Link to="/">
            <img className="logo" src={assets.logo} alt="" />
          </Link>
          {/*<Link to='/'><p className='title'>O.M.K DS</p></Link>*/}
          <p>
            Say goodbye to meal planning and grocery runs. We deliver fresh,
            organic ingredients and step-by-step recipes straight to your
            door—ready to transform into a gourmet meal in 30 minutes or less.
          </p>
          <div className="footer-social-icons">
            <a href="https://github.com/">
              <img src={assets.github2} alt="" />
            </a>
            <a href="https://www.linkedin.com/in/shreyasdeshpande7/">
              <img src={assets.linkedin_icon} alt="" />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <a href="#">
              <li>Home</li>
            </a>
            <a href="#explore-menu">
              <li>Menu</li>
            </a>
            <a href="#subscription-plan">
              <li>Meal Plans</li>
            </a>
            <a href="#app-download">
              <li>App</li>
            </a>
            <a href="">
              <li>Privacy policy</li>
            </a>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+852-2766 5949</li>
            <li>contact@polyu.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 © PolyU - Group35 - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
