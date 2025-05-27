import './PropertyDetails.css';

function PropertyDetails({ location, guests, bedrooms, singlebeds, doublebeds, bathrooms }) {
  return (
    <div className="property-details">
      <h2>{location}</h2>
      <div className="property-specs">
        <span>{guests} guests</span>
        <span className="dot-separator">·</span>
        <span>{bedrooms} bedrooms</span>
        {singlebeds > 0 && (
          <>
            <span className="dot-separator">·</span>
            <span>{singlebeds} singlebed</span>
          </>
        )}
        {doublebeds > 0 && (
          <>
            <span className="dot-separator">·</span>
            <span>{doublebeds} doublebed</span>
          </>
        )}
        {/* <span className="dot-separator">·</span>
        <span>{bathrooms} bathrooms</span> */}
      </div>
    </div>
  );
}

export default PropertyDetails;