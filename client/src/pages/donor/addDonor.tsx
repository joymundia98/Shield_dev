import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface DonorForm {
  donorType: string;
  location: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  preferredContact: string;
  companyName: string;
  orgEmail: string;
  orgPhone: string;
  address: string;
}

const AddDonor: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState<DonorForm>({
    donorType: "",
    location: "",
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    preferredContact: "",
    companyName: "",
    orgEmail: "",
    orgPhone: "",
    address: "",
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Donor submitted (no backend yet):", form);
    alert("Donor will be submitted to the database once backend is ready.");
  };

  const isIndividual = form.donorType === "individual";
  const isOrganization = form.donorType === "organization";

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input
              type="checkbox"
              checked={sidebarOpen}
              onChange={toggleSidebar}
            />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>
        <h2>DONOR MANAGER</h2>
        <a href="/donor/dashboard">Dashboard</a>
        <a href="/donor/donors" className="active">
          Donors List
        </a>
        <a href="/donor/donations">Donations</a>
        <a href="/donor/donorCategories">Donor Categories</a>
        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">
          ← Back to Main Dashboard
        </a>
      </div>

      {/* Page Content */}
      <div className="dashboard-content">
        <header className="page-header">
          <h1>Add Donor</h1>
          <div>
            <button
              className="add-btn"
              style={{ margin: "10px 0" }}
              onClick={() => navigate("/donor/donors")}
            >
              ← Back
            </button>
            <button className="hamburger" onClick={toggleSidebar}>
              &#9776;
            </button>
          </div>
        </header>

        <div className="container">
          <form className="add-form-styling" onSubmit={handleSubmit}>
            {/* DONOR TYPE */}
            <label>Donor Type</label>
            <select
              required
              value={form.donorType}
              onChange={(e) =>
                setForm({ ...form, donorType: e.target.value })
              }
            >
              <option value="">Select Donor Type</option>
              <option value="individual">Individual</option>
              <option value="organization">Organization</option>
            </select>

            {/* LOCATION */}
            <label>Location</label>
            <select
              required
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            >
              <option value="">Select Location</option>
              <option value="Local">Local</option>
              <option value="International">International</option>
            </select>

            {/* Individual Fields */}
            {isIndividual && (
              <>
                <label>First Name</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />

                <label>Last Name</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />

                <label>Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                <label>Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <label>Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                <label>Preferred Contact Method</label>
                <select
                  value={form.preferredContact}
                  onChange={(e) =>
                    setForm({ ...form, preferredContact: e.target.value })
                  }
                >
                  <option value="">Select Contact Method</option>
                  <option>Email</option>
                  <option>Phone</option>
                </select>
              </>
            )}

            {/* Organization Fields */}
            {isOrganization && (
              <>
                <label>Company Name</label>
                <input
                  type="text"
                  required
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                />

                <label>Email</label>
                <input
                  type="email"
                  required
                  value={form.orgEmail}
                  onChange={(e) =>
                    setForm({ ...form, orgEmail: e.target.value })
                  }
                />

                <label>Phone</label>
                <input
                  type="text"
                  value={form.orgPhone}
                  onChange={(e) =>
                    setForm({ ...form, orgPhone: e.target.value })
                  }
                />
              </>
            )}

            {/* Address */}
            <label>Address</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            {/* Buttons */}
            <div className="form-buttons">
              <button type="submit" className="add-btn">
                Add Donor
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/donor/donors")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDonor;
