import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface DonorType {
  id: number;
  name: string;
}

interface DonorSubcategory {
  id: number;
  donor_type_id: number;
  name: string;
}

interface DonorForm {
  donorTypeId: number | null;
  donorSubcategoryId: number | null;
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

  // Form state
  const [form, setForm] = useState<DonorForm>({
    donorTypeId: null,
    donorSubcategoryId: null,
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

  // Dynamic dropdowns
  const [donorTypes, setDonorTypes] = useState<DonorType[]>([]);
  const [subcategories, setSubcategories] = useState<DonorSubcategory[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch donor types
  useEffect(() => {
    fetch("http://localhost:3000/api/donors/donor_types")
      .then((res) => res.json())
      .then((data) => setDonorTypes(data))
      .catch((err) => console.error("Failed to load donor types", err));
  }, []);

  // Fetch subcategories when donor type changes
  useEffect(() => {
    if (!form.donorTypeId) {
      setSubcategories([]);
      return;
    }
    fetch(
      `http://localhost:3000/api/donors/donor_sub_category?donor_type_id=${form.donorTypeId}`
    )
      .then((res) => res.json())
      .then((data) => setSubcategories(data))
      .catch((err) => console.error("Failed to load subcategories", err));
  }, [form.donorTypeId]);

  const isIndividual = form.donorTypeId === 1; // assuming 1 = Individual
  const isOrganization = form.donorTypeId === 2; // assuming 2 = Corporate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: any = {
        donor_type_id: form.donorTypeId,
        donor_subcategory_id: form.donorSubcategoryId || null,
        address: form.address,
        phone: isIndividual ? form.phone : form.orgPhone,
        email: isIndividual ? form.email : form.orgEmail,
        preferred_contact_method: form.preferredContact || null,
        is_active: true,
      };

      if (isIndividual) {
        payload.name = `${form.firstName} ${form.lastName}`;
        payload.organization_id = null;
      } else if (isOrganization) {
        payload.name = form.companyName;
        payload.organization_id = 1; // adjust logic if needed
      }

      const res = await fetch("http://localhost:3000/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add donor");
      }

      setSuccess(true);
      setForm({
        donorTypeId: null,
        donorSubcategoryId: null,
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content">
        <header className="page-header">
          <h1>Add Donor</h1>
          <button className="add-btn" onClick={() => navigate("/donor/donors")}>
            ← Back
          </button>
        </header>

        <div className="container">
          <form className="add-form-styling" onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Donor added successfully!</p>}

            {/* Donor Type */}
            <label>Donor Type</label>
            <select
              required
              value={form.donorTypeId ?? ""}
              onChange={(e) =>
                setForm({ ...form, donorTypeId: Number(e.target.value) })
              }
            >
              <option value="">Select Donor Type</option>
              {donorTypes.map((dt) => (
                <option key={dt.id} value={dt.id}>
                  {dt.name}
                </option>
              ))}
            </select>

            {/* Donor Subcategory */}
            {subcategories.length > 0 && (
              <>
                <label>Donor Subcategory</label>
                <select
                  value={form.donorSubcategoryId ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, donorSubcategoryId: Number(e.target.value) })
                  }
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
              </>
            )}

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
                  onChange={(e) => setForm({ ...form, orgEmail: e.target.value })}
                />
                <label>Phone</label>
                <input
                  type="text"
                  value={form.orgPhone}
                  onChange={(e) => setForm({ ...form, orgPhone: e.target.value })}
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

            <div className="form-buttons">
              <button type="submit" className="add-btn" disabled={loading}>
                {loading ? "Submitting..." : "Add Donor"}
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
