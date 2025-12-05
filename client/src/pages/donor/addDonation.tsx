import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Donor {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  donor_type_id: number;
  donor_subcategory_id: number;
}

interface DonationForm {
  donorRegistered: boolean | null;
  donorType: string;
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  donorId: number | null;
  donorTypeId: number | null;
  subcategoryId: number | null;

  subcategory: string;
  date: string;
  amount: number | null;
  method: string;
  purpose: number | ""; // number for purpose_id
  notes: string;
  isAnonymous: string;
}

const AddDonation: React.FC = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  // ---------------- DONORS FROM DATABASE ----------------
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/donors")
      .then((res) => res.json())
      .then((data) => setDonors(data))
      .catch((err) => console.error("Failed to load donors", err));
  }, []);

  // ------------------------------------------------------
  // FORM STATE
  // ------------------------------------------------------
  const [form, setForm] = useState<DonationForm>({
    donorRegistered: null,
    donorType: "",
    donorName: "",
    donorPhone: "",
    donorEmail: "",
    donorId: null,
    donorTypeId: null,
    subcategoryId: null,

    subcategory: "",
    date: "",
    amount: null,
    method: "",
    purpose: "",
    notes: "",
    isAnonymous: "",
  });

  // ------------------------------------------------------
  // SUBMIT DONATION TO BACKEND
  // ------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      donor_registered: form.donorRegistered,
      donor_id: form.donorRegistered ? form.donorId : null,
      donor_type_id: form.donorRegistered ? form.donorTypeId : null,
      donor_subcategory_id: form.donorRegistered ? form.subcategoryId : null,

      is_anonymous: form.isAnonymous === "true",

      donor_name: form.donorName,
      donor_phone: form.donorPhone,
      donor_email: form.donorEmail,

      date: form.date,
      amount: form.amount,
      method: form.method,
      purpose_id: form.purpose,
      notes: form.notes,
    };

    try {
      const res = await fetch("http://localhost:3000/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add donation");

      alert("Donation added successfully!");
      navigate("/donor/donations");
    } catch (err) {
      console.error(err);
      alert("Failed to add donation");
    }
  };

  // ------------------------------------------------------
  // MAP DONORS FOR DROPDOWN
  // ------------------------------------------------------
  const registeredIndividuals = donors.filter((d) => d.donor_type_id === 1);
  const registeredOrganizations = donors.filter((d) => d.donor_type_id === 2);

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

        <h2>FINANCE</h2>
        <a href="/donor/dashboard">Dashboard</a>
        <a href="/donor/donors">Donors</a>
        <a href="/donor/donations" className="active">Donations</a>
        <a href="/donor/reports">Reports</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <header className="page-header">
          <h1>Add Donation</h1>
          <button className="hamburger" onClick={toggleSidebar}>&#9776;</button>
        </header>

        <div className="container">
          <form className="add-form-styling" onSubmit={handleSubmit}>
            {/* REGISTERED DONOR */}
            <label>Registered Donor?</label>
            <select
              required
              value={form.donorRegistered === null ? "" : form.donorRegistered ? "true" : "false"}
              onChange={(e) =>
                setForm({
                  ...form,
                  donorRegistered: e.target.value === "true",
                  donorType: "",
                  donorName: "",
                  donorPhone: "",
                  donorEmail: "",
                  donorId: null,
                })
              }
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>

            {/* REGISTERED DONOR TYPE */}
            {form.donorRegistered && (
              <>
                <label>Donor Type</label>
                <select
                  value={form.donorType}
                  onChange={(e) => setForm({ ...form, donorType: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="individual">Individual</option>
                  <option value="organization">Organization</option>
                </select>

                {/* REGISTERED DONOR NAME */}
                {form.donorType && (
                  <>
                    <label>Donor Name</label>
                    <select
                      value={form.donorId ?? ""}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        const donor = donors.find((d) => d.id === id);

                        setForm({
                          ...form,
                          donorId: id,
                          donorName: donor?.name ?? "",
                          donorPhone: donor?.phone ?? "",
                          donorEmail: donor?.email ?? "",
                          donorTypeId: donor?.donor_type_id ?? null,
                          subcategoryId: donor?.donor_subcategory_id ?? null,
                        });
                      }}
                    >
                      <option value="">Select</option>
                      {(form.donorType === "individual"
                        ? registeredIndividuals
                        : registeredOrganizations
                      ).map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </>
            )}

            {/* UNREGISTERED DONOR */}
            {form.donorRegistered === false && (
              <>
                <label>Anonymous?</label>
                <select
                  value={form.isAnonymous}
                  onChange={(e) => setForm({ ...form, isAnonymous: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>

                {form.isAnonymous === "false" && (
                  <>
                    <label>Donor Type</label>
                    <select
                      value={form.donorType}
                      onChange={(e) => setForm({ ...form, donorType: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="individual">Individual</option>
                      <option value="organization">Organization</option>
                    </select>

                    <label>Donor Name</label>
                    <input
                      type="text"
                      value={form.donorName}
                      onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                      placeholder="Enter donor name"
                    />

                    <label>Phone</label>
                    <input
                      type="tel"
                      value={form.donorPhone}
                      onChange={(e) => setForm({ ...form, donorPhone: e.target.value })}
                    />

                    <label>Email</label>
                    <input
                      type="email"
                      value={form.donorEmail}
                      onChange={(e) => setForm({ ...form, donorEmail: e.target.value })}
                    />
                  </>
                )}
              </>
            )}

            {/* DONATION DETAILS */}
            <label>Donation Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <label>Amount</label>
            <input
              type="number"
              required
              value={form.amount ?? ""}
              onChange={(e) =>
                setForm({ ...form, amount: Number(e.target.value) })
              }
            />

            <label>Payment Method</label>
            <select
              required
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
            >
              <option value="">Select</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Mobile Money</option>
              <option>Check</option>
            </select>

            <label>Purpose</label>
            <select
              required
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: Number(e.target.value) })}
            >
              <option value="">Select</option>
              <option value={1}>Tithes</option>
              <option value={2}>Offering</option>
              <option value={3}>Special Fund</option>
              <option value={4}>Disaster Relief</option>
              <option value={5}>Other</option>
            </select>

            <label>Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <div className="form-buttons">
              <button className="add-btn" type="submit">Add Donation</button>
              <button className="cancel-btn" type="button" onClick={() => navigate("/donor/donations")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDonation;
