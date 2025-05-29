'use client';

import { useState, useEffect } from "react"
import React from "react"
import "./Listingpage.css"

import Header from '../../Components/list/Header';
import PhotoGallery from '../../Components/list/PhotoGallery';
import PropertyDetails from '../../Components/list/PropertyDetails';
import GuestFavorite from '../../Components/list/GuestFavorite';
import Amenities from '../../Components/list/Amenities';
import BookingWidget from '../../Components/list/BookingWidget';
import ImageModal from '../../Components/list/ImageModal';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import MapLoader from "../../Components/list/MapLoader";
import PropertyLocationMap from "../../Components/list/PropertyLocationMap";
import loading from '../../animation/loading-anime.json';
import Lottie from "react-lottie";
import AboutSection from "../../Components/list/AboutSection";

export default function ListingPage({ params }) {
  const { id: listingId } = React.use(params)
  const [listing, setListing] = useState(null)
  const [mainImage, setMainImage] = useState("")
  const [saved, setSaved] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [checkInDate, setCheckInDate] = useState(null)
  const [checkOutDate, setCheckOutDate] = useState(null)
  const [guestCount, setGuestCount] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [nights, setNights] = useState(0)
  const [dayWisePrices, setDayWisePrices] = useState({})
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [infantCount, setInfantCount] = useState(0);
  const [bedCount, setBedCount] = useState(1);
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amenitiesMap = {
    "682df81fa7e54c68fec49ac1": "wifi",
    "682df829a7e54c68fec49ac4": "tv",
    "682df839a7e54c68fec49ac7": "kitchen",
    "682df848a7e54c68fec49aca": "laundry",
    "682df85ba7e54c68fec49acd": "free_parking",
    "682df86ea7e54c68fec49ad0": "paid_parking",
    "682df87fa7e54c68fec49ad3": "air_conditioning",
    "682df899a7e54c68fec49ad6": "dedicated_workspace",
    "682df8afa7e54c68fec49ad9": "include_breakfast",
    "682df8baa7e54c68fec49adc": "swimming_pool",
    "682df8c7a7e54c68fec49adf": "hot_tub",
    "682df8d5a7e54c68fec49ae2": "patio",
    "682df8e0a7e54c68fec49ae5": "bbq_grill",
    "682df8f6a7e54c68fec49ae8": "dining_area",
    "682df917a7e54c68fec49aeb": "campfire_firepit",
    "682df927a7e54c68fec49aee": "pool_table",
    "682df946a7e54c68fec49af1": "indoor_fireplace",
    "682df955a7e54c68fec49af4": "piano",
    "682df96fa7e54c68fec49af7": "fitness_center",
    "682df97fa7e54c68fec49afa": "lake_access",
    "682df995a7e54c68fec49afd": "beach_access",
    "682df9afa7e54c68fec49b00": "ski_in_ski_out",
    "682df9c3a7e54c68fec49b03": "outdoor_shower",
    "682df9d2a7e54c68fec49b06": "smoke_alarm",
    "682df9e2a7e54c68fec49b09": "first_aid_kit",
    "682df9f8a7e54c68fec49b0c": "carbon_monoxide_alarm",
    "682dfa04a7e54c68fec49b0f": "security",
    "682dfa0ea7e54c68fec49b12": "cctv",
    "682dfa18a7e54c68fec49b15": "restaurant",
    "682dfa20a7e54c68fec49b18": "bar",
    "682dfa27a7e54c68fec49b1b": "spa",
    "682dfa36a7e54c68fec49b1e": "room_service",
    "682dfa47a7e54c68fec49b21": "pet_friendly",
    "682dfa51a7e54c68fec49b24": "fridge",
    "682dfa5da7e54c68fec49b27": "microwave",
    "682dfa68a7e54c68fec49b2a": "coffee_maker",
    "682dfa81a7e54c68fec49b2d": "baby_facilities",
    "682dfa8ea7e54c68fec49b30": "hair_dryer",
    "682dfaa0a7e54c68fec49b33": "ceiling_fan",
    "682dfab1a7e54c68fec49b36": "elevator",
    "682dfabfa7e54c68fec49b39": "ev_charging",
    "682dfacba7e54c68fec49b3c": "tent_space",
    "682dfadba7e54c68fec49b3f": "bike_rental",
  }

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`https://host.cozyhomestays.com/api/scearch/${listingId}`)
        const data = await res.json()
        const fullPropertyDetails = data.data?.fullproperty[0]

        // Extract the main image
        let mainImageUrl = ""
        if (fullPropertyDetails && fullPropertyDetails.mediaInput) {
          const mainImageObj = fullPropertyDetails.mediaInput.find((img) => img.isMain)
          if (mainImageObj) {
            mainImageUrl = `https://host.cozyhomestays.com/uploads/fullproperty/${mainImageObj.filename}`
          }
        }

        setMainImage(mainImageUrl)
        setListing(data.data)

        // Extract day-wise prices
        const dayWisePrices = data.data?.PropertyFullPrice[0]?.dayWisePrices || {}
        setDayWisePrices(dayWisePrices)

        console.log("Fetched listing data:", data.data)
      } catch (err) {
        console.error("Error fetching listing:", err)
      }
    }

    fetchListing()
  }, [listingId])

  useEffect(() => {
    if (listing) {
      calculatePrice()
    }
  }, [checkInDate, checkOutDate, guestCount, listing])

  const toggleSave = () => setSaved(!saved)

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: listing?.PropertyAddress[0]?.propertyName || "Property",
          text: "Check out this amazing listing!",
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error))
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err))
    }
  }

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);

    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);

    if (typeof document !== "undefined") {
      document.body.style.overflow = "auto";
    }
  };

  const calculatePrice = () => {
    if (!checkInDate || !checkOutDate || !listing) return

    const start = new Date(checkInDate)
    const end = new Date(checkOutDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    setNights(diffDays)

    const basePrice = listing.PropertyFullPrice[0]?.fullprice || 0
    const additionalGuestCost = listing.fullproperty[0]?.extraguistcharge || 0
    const extraGuests = guestCount > 1 ? guestCount - 1 : 0
    const newTotal = basePrice * diffDays + extraGuests * additionalGuestCost

    setTotalPrice(newTotal)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      setIsSubmitting(true);
  
      // Prepare the data to send
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        checkindate: checkInDate,
        checkoutdate: checkOutDate,
        adults: guestCount,
        children: infantCount, // Assuming `infantCount` represents children
        bedroom: bedCount,
        pets: "No", // You can add a state for pets if needed
        propertyid: listingId, // Use the propertyid prop here
        totalprice: totalPrice,
      };
  
      try {
        // Send the POST request
        const response = await fetch("https://host.cozyhomestays.com/api/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log("Booking successful:", result);
  
          // Show success message
          alert(`Thank you for your booking, ${formData.name}! Your booking has been confirmed.`);
  
          // Reset form and state
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
          });
          setCheckInDate(null);
          setCheckOutDate(null);
          setGuestCount(1);
          setInfantCount(0);
          setBedCount(1);
          setFormStep(1);
          setTotalPrice(0);
        } else {
          const error = await response.json();
          console.error("Booking failed:", error);
          alert("Failed to book. Please try again.");
        }
      } catch (error) {
        console.error("Error while booking:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
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
            onSave={toggleSave}
            onShare={handleShare}
            saved={saved}
          />
          <PhotoGallery
                media={
                  listing.fullproperty[0]?.mediaInput.map((img) => {
                    console.log("Mapping media item:", img); // Debugging step
                    return {
                      ...img,
                      url: `https://host.cozyhomestays.com/${img.path.replace(/\\/g, "/")}`,
                      mimetype: img.mimetype, // Ensure mimetype is passed
                    };
                  }) || []
                }
                onMediaClick={openImageModal}
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
              {/* <AboutSection></AboutSection> */}
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
            onClose={closeImageModal}
            onNext={() => setSelectedImageIndex((selectedImageIndex + 1) % listing.fullproperty[0]?.mediaInput.length)}
            onPrev={() =>
              setSelectedImageIndex(
                (selectedImageIndex - 1 + listing.fullproperty[0]?.mediaInput.length) %
                  listing.fullproperty[0]?.mediaInput.length,
              )
            }
          />
        )}
      </div>
      <Footer />
    </>
  )
}
