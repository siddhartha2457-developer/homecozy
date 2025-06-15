import { Trophy, Star } from './Icons';
import './GuestFavorite.css';
import PropertyDetails from './PropertyDetails';
import AboutSection from './AboutSection';

function GuestFavorite({ rating, reviews, aboutText, propertyData }) {
  return (
    <div className="guest-favorite">
      <div className="favorite-badge">
        <AboutSection aboutText={aboutText} propertyData={propertyData} />
        <div className="trophy-icon">
           {/* <Trophy /> 
            <PropertyDetails
                location="Entire villa in Jalandhar, India"
                guests={16}
                bedrooms={6}
                beds={10}
                bathrooms={8}
              />  */}
        </div>
        {/* <div className="favorite-text">
          <h3>Most Popular</h3>
          <p>One of the most loved homes on Airbnb, according to guests</p>
        </div> */}
      </div>
      <div className="rating-section">
        <div className="rating">
          <span className="rating-value">4.5</span>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} filled={true} />
            ))}
          </div>
        </div>
        <div className="reviews-count">
          <span>23</span>
          <span>Reviews</span>
        </div>
      </div>
    </div>
  );
}

export default GuestFavorite;