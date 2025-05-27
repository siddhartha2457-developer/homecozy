import React from 'react';
import Link from 'next/link'; // Use Next.js Link
import './Navbar.css';
// import SearchBar from '../Components/SearchBar'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link href="/" className="Link-style">
            <span className="logo">CozyHomeStays</span>
          </Link>
        </div>
        {/* <div className="navbar-right">
          <Link href="#" className="property-link">List your property</Link>
          <button className="nav-btn">Register</button>
          <button className="nav-btn">Sign in</button>
        </div> */}
      </div>
      {/* <SearchBar></SearchBar> */}
    </nav>
  );
};

export default Navbar;