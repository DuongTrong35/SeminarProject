import React from "react";
import { FaShieldAlt, FaAward, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  return (
    <>
      <div className="trust-indicators">
        <div className="trust-item">
          <FaShieldAlt />
          <span>Verified Reviews</span>
        </div>
        <div className="trust-item">
          <FaAward />
          <span>Quality Assured</span>
        </div>
        <div className="trust-item">
          <FaUsers />
          <span>10,000+ Visitors</span>
        </div>
        <div className="trust-item">
          <FaMapMarkerAlt />
          <span>24 Locations</span>
        </div>
      </div>
      <footer className="footer">
        <div className="container footer-main">
          <div className="footer-about">
            <h3>About Vĩnh Khánh Food Street</h3>
            <p>Discover authentic Vietnamese cuisine in Quận 4's premier food destination. Our automatic tour guide helps you explore the best local eateries with ease.</p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#food-directory">Food Directory</a></li>
              <li><a href="#featured-foods">Featured Foods</a></li>
              <li><a href="#map">Location Map</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact & Support</h3>
            <p>Email: info@vinhkhanhfood.vn</p>
            <p>Phone: +84 123 456 789</p>
            <p>Address: Quận 4, Ho Chi Minh City</p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>© {new Date().getFullYear()} Vĩnh Khánh Food Street. All rights reserved.</p>
            <p>Built with ❤️ for food lovers</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;