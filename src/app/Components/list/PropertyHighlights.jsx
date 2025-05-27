import { Trophy, Pool, Star } from './Icons';
import './PropertyHighlights.css';

function PropertyHighlights() {
  const highlights = [
    {
      id: 1,
      icon: <Trophy />,
      title: 'Most favorite among chandigarh',
      description: 'This home is one of the highest ranked based on ratings, reviews and reliability.'
    },
    {
      id: 2,
      icon: <Pool />,
      title: 'Dive right in',
      description: 'This is one of the few places in the area with a pool.'
    },
    {
      id: 3,
      icon: <Star />,
      title: 'Exceptional check-in experience',
      description: 'Recent guests gave the check-in process a 5-star rating.'
    }
  ];

  return (
    <div className="property-highlights">
      {highlights.map(highlight => (
        <div key={highlight.id} className="highlight-item">
          <div className="highlight-icon">
            {highlight.icon}
          </div>
          <div className="highlight-content">
            <h3>{highlight.title}</h3>
            <p>{highlight.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PropertyHighlights;