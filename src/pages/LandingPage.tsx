import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/headerlogo.png"; // your logo
import heroImage from "../assets/heroImage.jpeg"; // your hero image
import "./LandingPage.css";

export const LandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuLinks = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/#features" },
    { label: "Who we serve", path: "/#who-we-serve" },
    { label: "Sign In / Sign Up", path: "/login" },
    { label: "Contact", path: "/#contact" },
  ];

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="landing-page-wrapper">
      {/* Header */}
      <header>
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="SCI-ELD Logo" className="logo-img" />
          </Link>
        </div>
        <nav>
          {menuLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className={idx === 0 ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button className="hamburger" onClick={openSidebar}>
          &#9776;
        </button>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <h2>Menu</h2>
        <button className="close-btn" onClick={closeSidebar}>
          &times;
        </button>
        {menuLinks.map((link, idx) => (
          <Link
            key={idx}
            to={link.path}
            className={idx === 0 ? "active" : ""}
            onClick={closeSidebar}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Landing page content */}
      <section className="landing-page">
        <div className="container">
          <div className="content">
            <div className="text-cont">
              <h1 className="header">
                <span className="first-clr">SCI-ELD</span> Church{" "}
                <span className="first-clr">Management</span> Platform
              </h1>
              <p className="description">
                SCI-ELD - Sustainable Church Initiative for Effective Leadership
                Development
              </p>
              <Link to="/register">
                <button className="btn btn-discover">Get Started</button>
              </Link>
            </div>
            <div className="img-cont">
              <img className="img" src={heroImage} alt="Hero" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
