"use client";

import { useState, useEffect } from "react"
import Head from "next/head"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import PropertyTypeSelector from "./list/PropertyTypeSelector"
import PropertyMap from "./PropertyMap"
import SearchBar from "./SearchBar"
import CategoryFilter from "./CategoryFilter"
import styles from "./Search.module.css"
import Link from "next/link"
import MapLoader from "./list/MapLoader"

export default function Search() {
  const searchParams = typeof window !== "undefined" ? useSearchParams() : null;
  const query = searchParams ? searchParams.get("q") : null;

  const [selectedPropertyType, setSelectedPropertyType] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [allProperties, setAllProperties] = useState([]) // Store all properties from API
  const [properties, setProperties] = useState([]) // Properties after location search
  const [filteredProperties, setFilteredProperties] = useState([]) // Properties after all filters
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [availableAmenities, setAvailableAmenities] = useState([])
  const [availablePropertyTypes, setAvailablePropertyTypes] = useState([])
  const [searchLocation, setSearchLocation] = useState("") // Current search location

  // Extract unique property types and amenities from properties
  const extractFilters = (propertiesData) => {
    const types = new Set()
    const amenities = new Set()

    propertiesData.forEach((property) => {
      if (property.type) {
        types.add(property.type)
      }

      if (property.amenities && Array.isArray(property.amenities)) {
        property.amenities.forEach((amenity) => {
          amenities.add(amenity)
        })
      }
    })

    setAvailablePropertyTypes(Array.from(types))
    setAvailableAmenities(Array.from(amenities))
  }

  // Process API data into our format
  const processApiData = (apiData) => {
    if (!apiData || !apiData.success || !Array.isArray(apiData.data)) {
      return []
    }

    return apiData.data.map((property) => {
      // Get the property address (first item in the array)
      const address = property.PropertyAddress && property.PropertyAddress[0]

      // Get the property category (first item in the array)
      const category = property.PropertyCategory && property.PropertyCategory[0]

      // Get the property price info (first item in the array)
      const priceInfo = property.PropertyFullPrice && property.PropertyFullPrice[0]

      // Get the property amenities
      const amenitiesObj = property.PropertyAminity && property.PropertyAminity[0]

      // Get the full property details
      const fullPropertyDetails = property.fullproperty && property.fullproperty[0]

      // Get main image URL
      let mainImage = ""
      if (fullPropertyDetails && fullPropertyDetails.mediaInput) {
        const mainImageObj = fullPropertyDetails.mediaInput.find((img) => img.isMain)
        if (mainImageObj) {
          // Convert backslashes to forward slashes for URLs
          mainImage = mainImageObj.path.replace(/\\/g, "/")
          // Ensure the URL is absolute
          if (!mainImage.startsWith("http")) {
            mainImage = `https://sampledemo.shop/${mainImage}`
          }
        }
      }

      // Extract price from dayWisePrices or fullprice
      let price = 0
      if (priceInfo) {
        if (priceInfo.fullprice) {
          price = priceInfo.fullprice
        } else if (priceInfo.dayWisePrices) {
          // Calculate average price from dayWisePrices
          const prices = Object.values(priceInfo.dayWisePrices)
          if (prices.length > 0) {
            price = prices.reduce((sum, p) => sum + p, 0) / prices.length
          }
        }
      }

      // Extract amenities IDs
      const amenitiesIds = amenitiesObj && amenitiesObj.amenities ? amenitiesObj.amenities : []

      // Map amenity IDs to more readable names
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
        "682dfadba7e54c68fec49b3f": "bike_rental"
      };
      const amenities = amenitiesIds.map((id) => amenitiesMap[id] || id)

      return {
        id: property.propertyId,
        name: address ? address.propertyName : "Unnamed Property",
        location: address ? `${address.city}, ${address.state}` : "Unknown Location",
        city: address ? address.city : "",
        state: address ? address.state : "",
        latitude: address ? address.latitude : 0,
        longitude: address ? address.longitude : 0,
        rating: 4.5, // Default rating since it's not in the API data
        reviewCount: 0, // Default review count since it's not in the API data
        type: category ? category.title.toLowerCase() : "unknown",
        price: price,
        image: mainImage || "/placeholder.jpg",
        amenities: amenities,
        fullAddress: address ? address.fullAddress : "",
        maxAttendant: fullPropertyDetails ? fullPropertyDetails.maxAttendant : 2,
        roomTypes: fullPropertyDetails ? fullPropertyDetails.roomTypes : { single: false, double: false },
        totalRooms: fullPropertyDetails ? fullPropertyDetails.totalRooms : 0,
      }
    })
  }

  // Fetch ALL properties from API without any query
  const fetchAllProperties = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Fetching all properties...")
      // Fetch without any query parameter to get all properties
      const response = await axios.get("https://sampledemo.shop/api/scearch")
      console.log("API Response:", response.data)

      const processedProperties = processApiData(response.data)
      console.log("Processed properties:", processedProperties)

      setAllProperties(processedProperties)
      setProperties(processedProperties) // Initially show all properties
      extractFilters(processedProperties)
    } catch (err) {
      console.error("Error fetching properties:", err)
      setError("Failed to fetch properties. Please try again.")

      // Fallback to sample data for development/testing
      const sampleProperties = [
        {
          id: "1",
          name: "Himalayan Serenity Cottage",
          location: "Manali, Himachal Pradesh",
          city: "Manali",
          state: "Himachal Pradesh",
          latitude: 32.2396,
          longitude: 77.1887,
          rating: 8.8,
          reviewCount: 1245,
          type: "hotel",
          price: 4500,
          image: "/cottage.jpg",
          amenities: ["wifi", "tv", "ac", "parking", "kitchen"],
          totalRooms: 2,
          maxAttendant: 4,
        },
        {
          id: "2",
          name: "Whispering Pines Retreat",
          location: "Dharamshala, Himachal Pradesh",
          city: "Dharamshala",
          state: "Himachal Pradesh",
          latitude: 32.219,
          longitude: 76.3234,
          rating: 9.1,
          reviewCount: 978,
          type: "apartment",
          price: 6800,
          image: "/cottage2.jpg",
          amenities: ["pool", "wifi", "tv", "ac", "parking"],
          totalRooms: 3,
          maxAttendant: 6,
        },
        {
          id: "3",
          name: "Kolkata Heritage Hotel",
          location: "Kolkata, West Bengal",
          city: "Kolkata",
          state: "West Bengal",
          latitude: 22.5726,
          longitude: 88.3639,
          rating: 8.2,
          reviewCount: 567,
          type: "hotel",
          price: 3200,
          image: "/cottage3.jpg",
          amenities: ["wifi", "tv", "ac", "breakfast"],
          totalRooms: 1,
          maxAttendant: 3,
        },
      ]

      setAllProperties(sampleProperties)
      setProperties(sampleProperties)
      extractFilters(sampleProperties)
    } finally {
      setLoading(false)
    }
  }

  // Filter properties by location search
  const filterByLocation = (searchTerm) => {
    console.log("Filtering properties by location:", searchTerm);

    if (!searchTerm.trim()) {
      console.log("Search term is empty. Resetting properties.");
      setProperties(allProperties);
      setSearchLocation("");
      return;
    }

    const filtered = allProperties.filter((property) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        property.location.toLowerCase().includes(searchLower) ||
        property.city.toLowerCase().includes(searchLower) ||
        property.state.toLowerCase().includes(searchLower) ||
        property.fullAddress.toLowerCase().includes(searchLower)
      );
    });

    console.log("Filtered properties:", filtered);
    setProperties(filtered); // Update the properties state with filtered results
    setSearchLocation(searchTerm);
  };

  const handleSearch = (searchTerm) => {
    console.log("Search triggered with term:", searchTerm);
    filterByLocation(searchTerm);
    setSelectedPropertyType(null);
    setSelectedCategories([]);
  };

  // Apply category and property type filters
  useEffect(() => {
    if (loading) return

    let result = [...properties]

    // Filter by property type if selected
    if (selectedPropertyType) {
      result = result.filter((p) => p.type === selectedPropertyType)
    }

    // Filter by selected categories/amenities
    if (selectedCategories.length > 0) {
      result = result.filter((property) =>
        selectedCategories.every((category) => property.amenities && property.amenities.includes(category)),
      )
    }

    setFilteredProperties(result)
  }, [properties, selectedPropertyType, selectedCategories, loading])

  // Fetch all properties on component mount
  useEffect(() => {
    fetchAllProperties()
  }, [])

  // Handle URL query parameter for location search
  useEffect(() => {
    if (query) {
      filterByLocation(query)
    }
  }, [query, allProperties])

  const handlePropertyTypeSelect = (typeId) => {
    console.log("Property type selected:", typeId)
    setSelectedPropertyType(typeId)
  }

  const handleCategoryFilterChange = (categories) => {
    console.log("Categories selected:", categories)
    setSelectedCategories(categories)
  }

  const handlePropertySelect = (propertyId) => {
    setSelectedProperty(propertyId)

    // Scroll to the property in the list
    const element = document.getElementById(`property-${propertyId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

useEffect(() => {
  if (selectedProperty) {
    const element = document.getElementById(`property-${selectedProperty}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}, [selectedProperty]);


  const clearAllFilters = () => {
    console.log("Clearing all filters")
    setSelectedPropertyType(null)
    setSelectedCategories([])
    setSearchLocation("")
    setProperties(allProperties)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Search Properties | CozyHomeStays</title>
        <meta name="description" content="Find your perfect stay Grab Best deals on Cottages, Hotels and Holidays at Cozyhomestays Villa Appartment hotel" />
      </Head>

      <SearchBar onSearch={handleSearch} />
          <PropertyTypeSelector onTypeSelect={handlePropertyTypeSelect} availableTypes={availablePropertyTypes} 
           selectedType={selectedPropertyType} // Pass current selected type
           onClearFilters={clearAllFilters}/>

      <main className={styles.main}>
        <div className={styles.filtersContainer}>
          <CategoryFilter onFilterChange={handleCategoryFilterChange} availableAmenities={availableAmenities}
                      selectedCategories={selectedCategories} // Pass current selected categories
                      onClearFilters={clearAllFilters} />
        </div>

        {(selectedPropertyType || selectedCategories.length > 0 || searchLocation) && (
          <div className={styles.activeFilters}>
            <div className={styles.filterTags}>
              {searchLocation && (
                <div className={styles.filterTag}>
                  <span>Location: {searchLocation}</span>
                  {/* <button onClick={() => clearAllFilters()}>×</button> */}
                  <button
                    onClick={() => {
                      setSearchLocation("")
                      setProperties(allProperties)
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              {selectedPropertyType && (
                <div className={styles.filterTag}>
                  <span>{selectedPropertyType}</span>
                  <button onClick={() => setSelectedPropertyType(null)}>×</button>
                </div>
              )}

              {selectedCategories.map((category) => (
                <div key={category} className={styles.filterTag}>
                  <span>{category}</span>
                  <button onClick={() => setSelectedCategories((prev) => prev.filter((c) => c !== category))}>×</button>
                </div>
              ))}
            </div>

            <button className={styles.clearFilters} onClick={clearAllFilters}>
              Clear all filters
            </button>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        <div className={styles.searchResults}>
          <div className={styles.mapSection}>
          <MapLoader>
              <PropertyMap
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onPropertySelect={handlePropertySelect}
              />
            </MapLoader>
          </div>

          <div className={styles.propertiesList}>
            <h2 className={styles.resultsTitle}>
              {loading ? (
                "Loading properties..."
              ) : (
                <>
                  {filteredProperties.length} {selectedPropertyType ? selectedPropertyType + "s" : "properties"} found
                  {searchLocation && ` in ${searchLocation}`}
                </>
              )}
            </h2>

            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Finding the best stays for you...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className={styles.noResults}>
                <p>No properties found. Try adjusting your filters.</p>
                <button className={styles.clearFilters} onClick={clearAllFilters}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={styles.propertyCards}>
                {filteredProperties.map((property) => (
                  <Link
                    key={property.id}
                    href={`property/${property.id}`} // Dynamic route with property ID
                    style={{ textDecoration: "none", color: "inherit" }} // Inline styles to remove anchor styles
                  >
                    <div
                      id={`property-${property.id}`}
                      className={`${styles.propertyCard} ${selectedProperty === property.id ? styles.selectedCard : ""}`}
                    >
                      <div className={styles.propertyImage}>
                        <img
                          src={property.image || ""}
                          alt={property.name}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = ""
                          }}
                        />
                        <button className={styles.favoriteButton}>♡</button>
                      </div>
                      <div className={styles.propertyInfo}>
                        <h3>{property.name}</h3>
                        <p className={styles.location}>{property.location}</p>
                        <div className={styles.propertyDetails}>
                          <span className={styles.detailItem}>
                            <span className={styles.detailIcon}>🛏️</span>
                            {property.totalRooms} {property.totalRooms === 1 ? "Room" : "Rooms"}
                          </span>
                          <span className={styles.detailItem}>
                            <span className={styles.detailIcon}>👥</span>
                            Max {property.maxAttendant} Guests
                          </span>
                        </div>
                        <div className={styles.propertyMeta}>
                          <span className={styles.propertyType}>{property.type}</span>
                          {property.rating > 0 && (
                            <div className={styles.rating}>
                              <span className={styles.ratingScore}>{property.rating}</span>
                              <span className={styles.reviewCount}>
                                {property.reviewCount > 0 ? `${property.reviewCount} reviews` : "New"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={styles.priceSection}>
                          <span className={styles.price}>₹{property.price}</span>
                          <span className={styles.perNight}>per night</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        
      </main>
    </div>
  )
}
