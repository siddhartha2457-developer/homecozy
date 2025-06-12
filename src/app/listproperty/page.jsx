'use client';
// app/page.tsx or app/some-page/page.tsx
import React from 'react';
import PropertyListingForm from '../Components/property-listing-form';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const testing = () => {
  return (
    <>
    <Navbar></Navbar>
    <PropertyListingForm></PropertyListingForm>
    <Footer></Footer>
    </>
  );
};

export default testing;
