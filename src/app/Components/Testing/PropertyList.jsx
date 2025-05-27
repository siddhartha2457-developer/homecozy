import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios.get('https://host.cozyhomestays.com/api/scearch')
      .then(response => {
        if (response.data.success) {
          setProperties(response.data.data);
        }
      })
      .catch(error => console.error('Error fetching properties:', error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((property) => {
          const mainImage = property.fullproperty[0]?.mediaInput.find(img => img.isMain);
          const propertyName = property.PropertyAddress[0]?.propertyName || 'Unnamed Property';
          const city = property.PropertyAddress[0]?.city;
          const price = property.PropertyFullPrice[0]?.fullprice || 'N/A';

          return (
            <div key={property.propertyId} className="border rounded-xl shadow-md overflow-hidden">
              {mainImage && (
                <img
                  src={`https://host.cozyhomestays.com/${mainImage.path.replace('\\', '/')}`}
                  alt={propertyName}
                  className="w-full h-60 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{propertyName}</h2>
                <p className="text-gray-600">{city}</p>
                <p className="text-lg font-bold mt-2">₹ {price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyList;
