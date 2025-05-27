import './HostInfo.css';

function HostInfo({ name, isSuperhost, hostingSince }) {
  return (
    <div className="host-info">
      <div className="host-profile">
        {/* <div className="host-avatar">
          <img src="/images/host-avatar.jpg" alt={`Host ${name}`} />
        </div> */}
        <div className="host-details">
          <h3>Hosted by {name}</h3>
          <p>{isSuperhost && 'Superhost'} · {hostingSince}</p>
        </div>
      </div>
    </div>
  );
}

export default HostInfo;