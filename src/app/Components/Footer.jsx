'use client';

import React from "react";
import "./Footer.css"; // Styling for the footer

import VantaBirds from "./VantaBirds";
// import {
//   FaFacebookF,
//   FaTwitter,
//   FaLinkedinIn,
//   FaInstagram,
 
// } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-section">
      {/* <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={1.5}
        amplitude={1.1}
        speed={0.7}
      /> */}
      <VantaBirds></VantaBirds>
    <footer className="footer">
      <div className="footer-top">
        <h2 className="footer-logo">CozyHomeStays</h2>
        <p className="footer-tagline">cozy stays across India</p>
      </div>
      {/* <hr className="footer-divider" /> */}
      <div className="footer-content">
        <div className="footer-column">
          <h4>ABOUT US</h4>
          <ul>
            <li>Our Story</li>
            <li>Blog</li>
            <li>Contact</li>
            <li>Partners</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>STAY LOCATIONS</h4>
          <ul>
            <li>Cottages in Manali</li>
            <li>Cottages in Dharamshala</li>
            <li>Cottages in Kasol</li>
            <li>Cottages in Rishikesh</li>
            <li>Cottages in Shimla</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>COLLECTIONS</h4>
          <ul>
            <li>Mountain View Cottages</li>
            <li>Forest Retreats</li>
            <li>Riverfront Stays</li>
            <li>Offbeat Getaways</li>
            <li>Workation Friendly</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>FOR GUESTS</h4>
          <ul>
            <li>Family-Friendly Cottages</li>
            <li>Couples’ Retreats</li>
            <li>Budget Stays</li>
            <li>Pet-Friendly Stays</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>WORK WITH US</h4>
          <ul>
            <li>List Your Cottage</li>
            <li>Partner With Us</li>
            <li>Careers</li>
          </ul>
          <h4>INFORMATION</h4>
          <ul>
            <li>Cancellation Policy</li>
            <li>Booking Policy</li>
            <li>Sitemap</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 CozyHomeStays. All rights reserved</p>
        <div className="social-icons">
          {/* <FaFacebookF />
          <FaTwitter />
          <FaLinkedinIn />
          <FaInstagram /> */}
          {/* <FaYoutube />
          <FaPinterestP /> */}
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;

  