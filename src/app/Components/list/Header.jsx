import { Share, Heart } from './Icons';
import './Header.css';

function Header({ title, onSave, onShare, saved }) {
  return (
    <div className="listing-header">
      <h1>{title}</h1>
      <div className="header-actions">
        <button className="action-button" onClick={onShare}>
          <Share />
          <span>Share</span>
        </button>
        <button className={`action-button ${saved ? 'saved' : ''}`} onClick={onSave}>
          <Heart filled={saved} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}

export default Header;