import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

interface Leave {
  id: number;
  staff_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  created_at: string;
  days: number;
  status: string;
}

const AddLeave: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [leaveTypes] = useState([
    { name: "Vacation Leave (PTO)", isPTO: true },
    { name: "Personal Leave", isPTO: false },
    { name: "Sick Leave", isPTO: false },
    { name: "Unpaid Leave", isPTO: false },
    { name: "Family Leave", isPTO: false },
    { name: "Maternity/Paternity Leave", isPTO: false },
    { name: "Bereavement Leave", isPTO: false },
    { name: "Public Holiday Leave", isPTO: false },
    { name: "Jury Duty Leave", isPTO: false },
    { name: "Military Leave", isPTO: false },
    { name: "Study Leave", isPTO: false },
    { name: "Compassionate Leave", isPTO: false },
    { name: "Religious Leave", isPTO: false },
    { name: "Sabbatical Leave", isPTO: false },
  ]);

  const [form, setForm] = useState<Leave>({
    id: 0,
    staff_id: 0,
    leave_type: "",
    start_date: "",
    end_date: "",
    created_at: new Date().toISOString(),
    days: 0,
    status: "pending",  // Default status (corrected to match the DB constraint)
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/staff");
        if (!response.ok) throw new Error("Failed to fetch staff members.");
        const staffData = await response.json();
        setStaffMembers(staffData);
      } catch (err: any) {
        console.error(err);
        alert("Failed to fetch staff members.");
      }
    };

    fetchStaffMembers();
  }, []);

  // Calculate days whenever start_date or end_date changes
  useEffect(() => {
    if (form.start_date && form.end_date) {
      const days = calculateDays(form.start_date, form.end_date);
      setForm((prevForm) => ({ ...prevForm, days }));
    }
  }, [form.start_date, form.end_date]); // Run whenever start_date or end_date changes

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return dayDiff + 1;  // Including the start date
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.staff_id || !form.leave_type || !form.start_date || !form.end_date) {
      alert("Please fill in all required fields.");
      return;
    }

    // Validate the status field before submitting
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(form.status)) {
      alert("Invalid status value. Please select a valid status.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/leave_requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to submit leave request.");
      }

      alert("Leave request submitted successfully!");
      navigate("/hr/leave");  // Redirect to leave management page
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input type="checkbox" checked={sidebarOpen} onChange={toggleSidebar} />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>

        <h2>HR MANAGER</h2>
        <a href="/hr/dashboard">Dashboard</a>
        <a href="/hr/staffDirectory">Staff Directory</a>
        <a href="/hr/payroll">Payroll</a>
        <a href="/hr/leave" className="active">Leave Management</a>
        <a href="/hr/departments">Departments</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a
          href="/"
          className="logout-link"
          onClick={(e) => {
            e.preventDefault();
            localStorage.clear();
            navigate("/");
          }}
        >
          ➜ Logout
        </a>
      </div>

      {/* Page Content */}
      <div className="dashboard-content">
        <header className="page-header">
          <h1>Request Leave</h1>
          <div>
            <button className="add-btn" onClick={() => navigate("/hr/leave")}>← Back</button>
            <button className="hamburger" onClick={toggleSidebar}>☰</button>
          </div>
        </header>

        <div className="container">
          <form className="add-form-styling" onSubmit={handleSubmit}>
            {/* STAFF MEMBER */}
            <label>Staff Member</label>
            <select
              required
              value={form.staff_id || ""}
              onChange={(e) => setForm({ ...form, staff_id: Number(e.target.value) })}
            >
              <option value="">-- Select Staff Member --</option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>

            {/* LEAVE TYPE */}
            <label>Leave Type</label>
            <select
              required
              value={form.leave_type}
              onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
            >
              <option value="">-- Select Leave Type --</option>
              {leaveTypes.map((leave) => (
                <option key={leave.name} value={leave.name}>
                  {leave.name}
                </option>
              ))}
            </select>

            {/* DATES */}
            <label>Start Date</label>
            <input
              type="date"
              required
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            />
            <label>End Date</label>
            <input
              type="date"
              required
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            />

            {/* DAYS */}
            <label>Days</label>
            <input
              type="number"
              value={form.days || 0}
              readOnly
              style={{ backgroundColor: "#f0f0f0" }}
            />

            {/* Status (Hidden) */}
            <input type="hidden" value={form.status} />

            {/* Submit */}
            <button type="submit" className="add-btn" style={{ marginTop: 20 }}>
              Submit Leave Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLeave;
