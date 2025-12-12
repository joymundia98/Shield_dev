import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Sidebar toggle effect
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [sidebarOpen]);

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input type="checkbox" checked={sidebarOpen} onChange={toggleSidebar} />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>

        <h2>ORG MANAGER</h2>
        <a href="/Organization/edittableProfile">Profile</a>
        <a href="/Organization/orgLobby" className="active">The Lobby</a>
        <a href="/Organization/ListedAccounts">Accounts Tracker</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">To SCI-ELD ERP</a>
        <a
          href="/"
          className="logout-link"
          onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate("/"); }}
        >
          ➜ Logout
        </a>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <header className="page-header">
          <h1>The Lobby</h1>
          <button className="hamburger" onClick={toggleSidebar}>
            ☰
          </button>
        </header>

        
          <h3 className="lobby-guide">
            The users listed below are presently in the lobby.<br />
            Please take a moment to review and either confirm or reject their account registration.
          </h3>

          <br/>

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
    </div>
  );
};

export default OrgLobby;
