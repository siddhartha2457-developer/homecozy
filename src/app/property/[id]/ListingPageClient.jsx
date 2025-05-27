"use client";

import { useState, useEffect } from "react";
import React from "react";
import "./Listingpage.css";

import Header from "../../Components/list/Header";
import PhotoGallery from "../../Components/list/PhotoGallery";
import PropertyDetails from "../../Components/list/PropertyDetails";
import GuestFavorite from "../../Components/list/GuestFavorite";
import Amenities from "../../Components/list/Amenities";
import BookingWidget from "../../Components/list/BookingWidget";
import ImageModal from "../../Components/list/ImageModal";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import MapLoader from "../../Components/list/MapLoader";
import PropertyLocationMap from "../../Components/list/PropertyLocationMap";
import loading from "../../animation/loading-anime.json";
import Lottie from "react-lottie";

export default function ListingPageClient({ listing, listingId }) {
  const [mainImage, setMainImage] = useState("");
  const [saved, setSaved] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  const [dayWisePrices, setDayWisePrices] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [infantCount, setInfantCount] = useState(0);
  const [bedCount, setBedCount] = useState(1);

  useEffect(() => {
    const fullPropertyDetails = listing?.fullproperty[0];

    // Extract the main image
    let mainImageUrl = "";
    if (fullPropertyDetails && fullPropertyDetails.mediaInput) {
      const mainImageObj = fullPropertyDetails.mediaInput.find((img) => img.isMain);
      if (mainImageObj) {
        mainImageUrl = `https://host.cozyhomestays.com/uploads/fullproperty/${mainImageObj.filename}`;
      }
    }

    setMainImage(mainImageUrl);

    // Extract day-wise prices
    const dayWisePrices = listing?.PropertyFullPrice[0]?.dayWisePrices || {};
    setDayWisePrices(dayWisePrices);
  }, [listing]);

  useEffect(() => {
    if (listing) {
      calculatePrice();
    }
  }, [checkInDate, checkOutDate, guestCount, listing]);

  const calculatePrice = () => {
    if (!checkInDate || !checkOutDate || !listing) return;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setNights(diffDays);

    const basePrice = listing.PropertyFullPrice[0]?.fullprice || 0;
    const additionalGuestCost = listing.fullproperty[0]?.extraguistcharge || 0;
    const extraGuests = guestCount > 1 ? guestCount - 1 : 0;
    const newTotal = basePrice * diffDays + extraGuests * additionalGuestCost;

    setTotalPrice(newTotal);
  };

  if (!listing) {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: loading,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    return (
      <div className="loading-container">
        <Lottie options={defaultOptions} height={200} width={200} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="app-container">
        <div className="listing-container">
          <Header
            title={listing.PropertyAddress[0]?.propertyName || "Property"}
            onSave={() => setSaved(!saved)}
            onShare={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: listing?.PropertyAddress[0]?.propertyName || "Property",
                    text: "Check out this amazing listing!",
                    url: window.location.href,
                  })
                  .catch((error) => console.log("Error sharing:", error));
              } else {
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => alert("Link copied to clipboard!"))
                  .catch((err) => console.error("Could not copy text: ", err));
              }
            }}
            saved={saved}
          />
          <PhotoGallery
            media={
              listing.fullproperty[0]?.mediaInput.map((img) => ({
                ...img,
                url: `https://host.cozyhomestays.com/${img.path.replace(/\\/g, "/")}`,
              })) || []
            }
            onMediaClick={(index) => {
              setSelectedImageIndex(index);
              setShowImageModal(true);
              document.body.style.overflow = "hidden";
            }}
          />

          <div className="listing-content">
            <div className="listing-details">
              <PropertyDetails
                location={listing.PropertyAddress[0]?.fullAddress}
                guests={listing.fullproperty[0]?.maxAttendant}
                bedrooms={listing.fullproperty[0]?.totalRooms}
                singlebeds={listing.fullproperty[0]?.totalSingleRooms}
                doublebeds={listing.fullproperty[0]?.totalDoubleRooms}
                bathrooms={listing.fullproperty[0]?.washroomType}
              />
              <GuestFavorite
                rating={listing.PropertyFullPrice[0]?.rating || 0}
                reviews={listing.PropertyFullPrice[0]?.reviews || 0}
              />
              <Amenities amenities={listing.PropertyAminity[0]?.amenities || []} />

              <div className="map-section">
                <MapLoader>
                  <PropertyLocationMap propertyData={listing} />
                </MapLoader>
              </div>
            </div>

            <div className="booking-section">
              <BookingWidget
                price={totalPrice}
                nights={nights}
                currency="₹"
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                guestCount={guestCount}
                setCheckInDate={setCheckInDate}
                setCheckOutDate={setCheckOutDate}
                setGuestCount={setGuestCount}
                dayWisePrices={dayWisePrices}
                occationprice={listing.PropertyFullPrice[0]?.occationprice || []}
                maxAttendant={listing.fullproperty[0]?.maxAttendant}
                singlebeds={listing.fullproperty[0]?.totalSingleRooms}
                doublebeds={listing.fullproperty[0]?.totalDoubleRooms}
                extraGuestCharge={listing.fullproperty[0]?.extraguistcharge}
                Extrabed={listing.fullproperty[0]?.addextrabed_charge}
                propertyid={listingId}
              />
            </div>
          </div>
        </div>

        {showImageModal && (
          <ImageModal
            images={
              listing.fullproperty[0]?.mediaInput.map((img) => ({
                ...img,
                url: `https://host.cozyhomestays.com/${img.path.replace(/\\/g, "/")}`,
              })) || []
            }
            selectedIndex={selectedImageIndex}
            onClose={() => {
              setShowImageModal(false);
              document.body.style.overflow = "auto";
            }}
            onNext={() =>
              setSelectedImageIndex((selectedImageIndex + 1) % listing.fullproperty[0]?.mediaInput.length)
            }
            onPrev={() =>
              setSelectedImageIndex(
                (selectedImageIndex - 1 + listing.fullproperty[0]?.mediaInput.length) %
                  listing.fullproperty[0]?.mediaInput.length
              )
            }
          />
        )}
      </div>
      <Footer />
    </>
  );
}