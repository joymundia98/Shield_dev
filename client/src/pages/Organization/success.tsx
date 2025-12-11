import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sidebarLogo from "../../assets/sidebarlogo.png"; // Update path as necessary
import "../../styles/global.css"; // You may need a separate CSS file or adjust styles accordingly

const OrganizationSuccessPage = () => {
  const [accountID] = useState("ABCD-1234-EFGH-5678"); // Mock Account ID, replace as necessary
  const navigate = useNavigate();

  // Function to copy the Account ID to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountID)
      .then(() => {
        alert('Account ID copied to clipboard!');
      })
      .catch((error) => {
        console.error('Error copying text: ', error);
        alert('Failed to copy Account ID.');
      });
  };

  return (
    <div className="organization-success-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={sidebarLogo} alt="Logo" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/org-settings">Settings</a></li>
            <li><a href="/org-logout">Logout</a></li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <h1>Your Organization was Registered Successfully!</h1>
        <p>Please ensure that your account ID is kept secure, as it will be necessary for logging this organization in.</p>

        {/* Glassmorphic Card with Account ID and Copy Button */}
        <div className="glassmorphic-card">
          <button className="copy-btn" onClick={copyToClipboard}>Copy Account ID</button>
          <div className="account-id" id="accountID">{accountID}</div>
        </div>

        <div className="next-steps">
          <p><strong>Next Steps:</strong></p>
          <p>Create an admin account to login to the Shield software.</p>
        </div>

        <button className="create-account-btn" onClick={() => navigate('/create-admin-account')}>+ Create Admin Account</button>
      </div>
    </div>
  );
};

export default OrganizationSuccessPage;
