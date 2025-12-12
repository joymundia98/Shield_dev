import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AdminAccount } from "../components/Auth/adminAccount"; // Assuming this is the file that contains your RegisterForm component

export const AdminAccountPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [sidebarOpen]);

  const menuLinks = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Settings", path: "/admin/settings" },
    { label: "Logout", path: "/logout" },
  ];

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`} id="sidebar">
        <h2>Admin Menu</h2>

        {/* STATIC-STYLE CLOSE BUTTON */}
        {sidebarOpen && (
          <div className="close-wrapper">
            <div className="toggle close-btn">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    closeSidebar();
                    e.target.checked = false; // reset animation same as static
                  }
                }}
              />
              <span className="button"></span>
              <span className="label">X</span>
            </div>
          </div>
        )}

        {menuLinks.map((link, idx) => (
          <Link
            key={idx}
            to={link.path}
            className={location.pathname === link.path ? "active" : ""}
            onClick={closeSidebar}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Hamburger */}
      {!sidebarOpen && (
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          &#9776;
        </button>
      )}

      {/* Admin Account Form */}
      <div className="admin-account-container">
        <h1>Create Admin Account</h1>
        <AdminAccount /> {/* This is where the RegisterForm component goes */}
      </div>
    </>
  );
};
