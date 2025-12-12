import React from 'react';
import './OrgLobby.css'; // Ensure this CSS file contains the necessary styles
import johnImage from '../../assets/Man.jpg'; // Import image from assets
import janeImage from '../../assets/girl.jpg'; // Import image from assets
import davidImage from '../../assets/Man2.jpg'; // Import image from assets

// TypeScript type for each lobby user card
interface LobbyUser {
  name: string;
  imageSrc: string;
  altText: string;
}

const lobbyUsers: LobbyUser[] = [
  { name: 'John Doe', imageSrc: johnImage, altText: 'John Doe' },
  { name: 'Jane Smith', imageSrc: janeImage, altText: 'Jane Smith' },
  { name: 'David Johnson', imageSrc: davidImage, altText: 'David Johnson' },
];

const OrgLobby: React.FC = () => {
  return (
    <div>
      <header>
        <h3>
          The users listed below are presently in the lobby.<br></br>
            Please take a moment to review and either confirm or reject their account registration.
        </h3>
      </header>

      <div className="lobbyContainer">
        {lobbyUsers.map((user, index) => (
          <div key={index} className="lobbyCard">
            <img
              src={user.imageSrc}
              alt={user.altText}
              className="lobbyCard-image"
            />
            <div className="lobbyCard-content">
              <h3 className="lobbyCard-name">{user.name}</h3>
              <div className="lobbyCard-buttons">
                <button className="approve-btn">Approve</button>
                <button className="reject-btn">Reject</button>
                <button className="add-btn">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrgLobby;
