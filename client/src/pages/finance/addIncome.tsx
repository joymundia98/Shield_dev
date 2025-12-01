import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface ExtraFields {
  [key: string]: string | number;
}

interface NewIncome {
  category: number | ""; // now referencing backend category IDs
  subcategory: number | "";
  date: string;
  source: string;
  description: string;
  amount: number | "";
  paymentMethod: string;
  attachments: File[];
  extraFields: ExtraFields;
}

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

const BACKEND_URL = "http://localhost:3000/api"; // adjust as needed

const AddIncome: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [form, setForm] = useState<NewIncome>({
    category: "",
    subcategory: "",
    date: "",
    source: "",
    description: "",
    amount: "",
    paymentMethod: "Cash",
    attachments: [],
    extraFields: {},
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  // Fetch categories and subcategories on mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/finance/income_categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to fetch categories:", err));

    fetch(`${BACKEND_URL}/finance/income_subcategories`)
      .then(res => res.json())
      .then(data => setAllSubcategories(data))
      .catch(err => console.error("Failed to fetch subcategories:", err));
  }, []);

  const handleCategoryChange = (categoryId: number) => {
    const filtered = allSubcategories.filter(sub => sub.category_id === categoryId);
    setSubcategories(filtered);
    setForm({ ...form, category: categoryId, subcategory: "", extraFields: {} });
  };

  const handleAttachments = (files: FileList | null) => {
    if (!files) return;
    setForm({ ...form, attachments: Array.from(files) });
  };

  const handleExtraFieldChange = (key: string, value: string | number) => {
    setForm({ ...form, extraFields: { ...form.extraFields, [key]: value } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        category_id: form.category,
        subcategory_id: form.subcategory,
        date: form.date,
        source: form.source,
        description: form.description,
        amount: form.amount,
        payment_method: form.paymentMethod,
        extra_fields: form.extraFields,
      };

      const res = await fetch(`${BACKEND_URL}/finance/incomes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Error: " + error.message);
        return;
      }

      alert("Income submitted successfully!");
      navigate("/finance/incometracker");
    } catch (err) {
      console.error("Failed to submit income:", err);
      alert("Server error");
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* sidebar content */}
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <header className="page-header income-header">
          <h1>Add Income</h1>
          <button className="hamburger" onClick={toggleSidebar}>☰</button>
        </header>

        <div className="container">
          <form className="add-form-styling" onSubmit={handleSubmit}>
            {/* Category */}
            <label>Income Category</label>
            <select
              required
              value={form.category}
              onChange={(e) => handleCategoryChange(parseInt(e.target.value))}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Subcategory */}
            <label>Subcategory</label>
            <select
              required
              value={form.subcategory}
              onChange={(e) => setForm({ ...form, subcategory: parseInt(e.target.value) })}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>

            {/* Date */}
            <label>Income Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            {/* Source */}
            <label>Source / Giver</label>
            <input
              type="text"
              placeholder="e.g. John Doe, Online Donor"
              required
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />

            {/* Description */}
            <label>Description</label>
            <textarea
              placeholder="What is this income for?"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            {/* Amount */}
            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: parseFloat(e.target.value) })
              }
            />

            {/* Payment Method */}
            <label>Payment Method</label>
            <select
              value={form.paymentMethod}
              required
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            >
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>POS</option>
              <option>Mobile Money</option>
              <option>Cheque</option>
              <option>Online Giving Platform</option>
            </select>

            {/* Attachments */}
            <label>Upload Documents / Receipts</label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => handleAttachments(e.target.files)}
            />

            {/* Extra fields could be rendered dynamically based on subcategory */}
            {form.extraFields &&
              Object.keys(form.extraFields).map((key) => (
                <div key={key}>
                  <label>{key}</label>
                  <input
                    type="text"
                    value={form.extraFields[key] as string}
                    onChange={(e) => handleExtraFieldChange(key, e.target.value)}
                  />
                </div>
              ))}

            <button type="submit" className="add-btn" style={{ marginTop: 20 }}>
              Submit Income
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddIncome;
