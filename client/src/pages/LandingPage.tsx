import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import AOS from "aos";
import "aos/dist/aos.css";

import logo from "../assets/headerlogo.png";
import heroImage from "../assets/heroImage.jpeg";
import churchImg from "../assets/church.jpg";
import ngoImg from "../assets/ngo.jpg";

import "./LandingPage.css";

// Register chart components
ChartJS.register(
  LineElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export const LandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(1); // default active card (red)

  const menuLinks = [
    { label: "Home", path: "home" },
    { label: "Features", path: "features" },
    { label: "Who we serve", path: "who-we-serve" },
    { label: "Sign In / Sign Up", path: "/login" },
    { label: "Contact", path: "contact" },
  ];

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  // ============================
  // 📊 MEMOIZED CHART DATA
  // ============================

  const attendanceData = useMemo(
    () => ({
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Weekly Attendance",
          data: [520, 560, 580, 600],
          borderColor: "#1A3D7C",
          backgroundColor: "rgba(26, 61, 124, 0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    }),
    []
  );

  const givingData = useMemo(
    () => ({
      labels: ["General Fund", "Missions", "Building Fund", "Outreach"],
      datasets: [
        {
          data: [15000, 8000, 5000, 6000],
          backgroundColor: ["#5C4736", "#817E7A", "#AF907A", "#20262C"],
        },
      ],
    }),
    []
  );

  // ============================
  // 🌟 AOS INITIALIZATION
  // ============================
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <div className="landing-page-wrapper">

      {/* =================== HEADER =================== */}
      <header>
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="SCI-ELD Logo" className="logo-img" />
          </Link>
        </div>

        <nav>
          {menuLinks.map((link, idx) =>
            link.path.startsWith("/") ? (
              <Link key={idx} to={link.path} className={idx === 0 ? "active" : ""}>
                {link.label}
              </Link>
            ) : (
              <ScrollLink
                key={idx}
                to={link.path}
                smooth={true}
                duration={500}
                offset={-70} // adjust if header is fixed
                className={idx === 0 ? "active" : ""}
              >
                {link.label}
              </ScrollLink>
            )
          )}
        </nav>

        <button className="hamburger" onClick={openSidebar}>
          &#9776;
        </button>
      </header>

      {/* =================== SIDEBAR =================== */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <h2>Menu</h2>
        <button className="close-btn" onClick={closeSidebar}>
          &times;
        </button>

        {menuLinks.map((link, idx) =>
          link.path.startsWith("/") ? (
            <Link
              key={idx}
              to={link.path}
              className={idx === 0 ? "active" : ""}
              onClick={closeSidebar}
            >
              {link.label}
            </Link>
          ) : (
            <ScrollLink
              key={idx}
              to={link.path}
              smooth={true}
              duration={500}
              offset={-70}
              onClick={closeSidebar}
              className={idx === 0 ? "active" : ""}
            >
              {link.label}
            </ScrollLink>
          )
        )}
      </div>

      {/* =================== HERO =================== */}
      <section id="home" className="landing-page" data-aos="fade-up">
        <div className="container">
          <div className="content">
            <div className="text-cont" data-aos="fade-right" data-aos-delay="200">
              <h1 className="header">
                <span className="first-clr">SCI-ELD</span> Church{" "}
                <span className="first-clr">Management</span> Platform
              </h1>

              <p className="description">
                SCI-ELD - Sustainable Church Initiative for Effective Leadership Development
              </p>

              <Link to="/register">
                <button className="btn btn-discover">Get Started</button>
              </Link>
            </div>

            <div className="img-cont" data-aos="fade-left" data-aos-delay="400">
              <img className="img" src={heroImage} alt="Hero" />
            </div>
          </div>
        </div>
      </section>

      {/* =================== FEATURES =================== */}
      <section id="features" className="features-section" data-aos="fade-up">
        <h1 data-aos="fade-up" data-aos-delay="100">Discover SCI-ELD Features</h1>

        <div className="feature-cards">
          {/* Attendance Trends */}
          <div
            className={`feature-card feature-card--purple ${activeCard === 0 ? "active" : ""}`}
            onMouseOver={() => setActiveCard(0)}
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="feature-card__outer">
              <div className="feature-card__inner">
                <div className="chart-box">
                  <h3 className="section-title">Attendance Trends</h3>
                  <Line data={attendanceData} />
                </div>

                <ul>
                  <li>Track the growth of your church</li>
                </ul>
              </div>

              <a href="#">Growth Visibility</a>
            </div>
          </div>

          {/* Prayer Requests */}
          <div
            className={`feature-card feature-card--red ${activeCard === 1 ? "active" : ""}`}
            onMouseOver={() => setActiveCard(1)}
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <div className="feature-card__outer">
              <div className="feature-card__inner">
                <div className="kpi-card">
                  <h3>Prayer Requests</h3>
                  <p>45</p>
                </div>

                <ul>
                  <li>Tend to the sheep by keeping up with their prayer requests</li>
                </ul>
              </div>

              <a href="#">Pastoral Care</a>
            </div>
          </div>

          {/* Donations by Fund */}
          <div
            className={`feature-card feature-card--green ${activeCard === 2 ? "active" : ""}`}
            onMouseOver={() => setActiveCard(2)}
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <div className="feature-card__outer">
              <div className="feature-card__inner">
                <div className="chart-box">
                  <h3 className="section-title">Donations by Fund</h3>
                  <Pie data={givingData} />
                </div>

                <ul>
                  <li>Have a better understanding of Church Funds</li>
                </ul>
              </div>

              <a href="#">Finance</a>
            </div>
          </div>
        </div>
      </section>

      {/* =================== WHO WE SERVE =================== */}
      <section id="who-we-serve" data-aos="fade-right">
        <section className="serve-section">
          <div className="container">
            <div className="row">
              <div className="content-column col-lg-6 col-md-12 col-sm-12 order-2" data-aos="fade-up" data-aos-delay="100">
                <div className="inner-column">
                  <div className="sec-title">
                    <h2>Who We Serve</h2>
                  </div>

                  <div className="text">
                    <p>
                      The SCI-ELD platform is built for more than churches —
                      it’s designed for NGOs as well. It delivers structure and
                      efficiency while fully supporting faith-based missions,
                      values, and initiatives.
                    </p>
                  </div>

                  <ul className="list-style-one">
                    <li> 🛡️ &nbsp; Local Churches & Ministries</li>
                    <li> 🛡️ &nbsp; NGOs & Funders</li>
                  </ul>
                </div>
              </div>

              <div className="image-column col-lg-6 col-md-12 col-sm-12" data-aos="fade-left" data-aos-delay="200">
                <div className="inner-column">
                  <figure className="image-1">
                    <img src={churchImg} alt="Church" />
                  </figure>

                  <figure className="image-2">
                    <img src={ngoImg} alt="NGO" />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* =================== CONTACT =================== */}
      <section id="contact" data-aos="fade-up">
        <h2 data-aos="fade-up" data-aos-delay="100">Contact</h2>

        <form data-aos="fade-up" data-aos-delay="200">
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Message" rows={5} required />
          <button type="submit">Send Message</button>
        </form>
      </section>

      {/* =================== FOOTER =================== */}
      <footer className="site-footer" data-aos="fade-up">
        <div className="container">
          <p>
            © 2025 — Built by <strong>Computers for Africa Solutions Limited</strong>
          </p>
        </div>
      </footer>
    </div>
  );
};
