import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LoginForm } from "../components/Auth/LoginForm";

export const LoginPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuLinks = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/#features" },
    { label: "Who we serve", path: "/#who-we-serve" },
    { label: "Sign In / Sign Up", path: "/login" },
    { label: "Contact", path: "/#contact" },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <h2>Menu</h2>
        <button
          className="close-btn"
          onClick={() => setSidebarOpen(false)}
        >
          &times;
        </button>
        {menuLinks.map((link, idx) => (
          <Link
            key={idx}
            to={link.path}
            className={
              location.pathname === link.path ? "active" : ""
            }
            onClick={() => setSidebarOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Hamburger */}
      {!sidebarOpen && (
        <button
          className="hamburger"
          onClick={() => setSidebarOpen(true)}
        >
          &#9776;
        </button>
      )}

      {/* Login Form */}
      <div className="login-parent-container">
        <LoginForm />
      </div>
    </>
  );
};
