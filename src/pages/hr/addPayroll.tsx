import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

// Define the interface for Payroll components
interface Payroll {
  staff_id: number;
  staff_name: string;
  department: string;
  role: string;
  salary: number;
  housing_allowance: number;
  transport_allowance: number;
  medical_allowance: number;
  overtime: number;
  bonus: number;
  total_gross: number;
  paye_tax_percentage: number;
  paye_tax_amount: number;
  napsa_contribution_percentage: number;
  napsa_contribution_amount: number;
  loan_deduction: number;
  union_dues: number;
  health_insurance: number;
  nhima_contribution: number;
  gratuity_severance: number;
  wcif: number;
  total_deductions: number;
  net_salary: number;
  payment_date: string;
}

const Payroll: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState<Payroll>({
    staff_id: 0,
    staff_name: "",
    department: "",
    role: "",
    salary: 0,
    housing_allowance: 0,
    transport_allowance: 0,
    medical_allowance: 0,
    overtime: 0,
    bonus: 0,
    total_gross: 0,
    paye_tax_percentage: 0,
    paye_tax_amount: 0,
    napsa_contribution_percentage: 5,
    napsa_contribution_amount: 0,
    loan_deduction: 0,
    union_dues: 0,
    health_insurance: 0,
    nhima_contribution: 0,
    gratuity_severance: 0,
    wcif: 0,
    total_deductions: 0,
    net_salary: 0,
    payment_date: "",
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  // Simulating fetching data (e.g., departments, roles, staff names)
  const departments = ["HR", "Engineering", "Marketing", "Sales"];
  const roles = ["Manager", "Engineer", "Administrator", "Analyst"];
  const staffNames = ["John Doe", "Jane Smith", "Michael Johnson", "Emily Davis"];

  useEffect(() => {
    // Simulating fetching staff details
    const staffData = {
      staff_id: 1,
      staff_name: "John Doe",
      department: "Engineering",
      role: "Software Engineer",
      salary: 5000,
      housing_allowance: 1000,
      transport_allowance: 500,
      medical_allowance: 200,
      overtime: 300,
      bonus: 500,
      payment_date: "2025-12-05",
    };
    setForm((prevForm) => ({
      ...prevForm,
      ...staffData,
    }));
  }, []);

  useEffect(() => {
    // Calculate payroll components when form values are updated
    const calculatePayroll = () => {
      const {
        salary,
        housing_allowance,
        transport_allowance,
        medical_allowance,
        overtime,
        bonus,
        paye_tax_percentage,
        napsa_contribution_percentage,
        union_dues,
        health_insurance,
        nhima_contribution,
        gratuity_severance,
        wcif,
      } = form;

      // Basic salary and allowances
      const totalGross =
        salary +
        housing_allowance +
        transport_allowance +
        medical_allowance +
        overtime +
        bonus;

      // PAYE Calculation based on Zambia's PAYE bands (example)
      let paye_tax = 0;
      if (totalGross <= 4000) {
        paye_tax = 0;
      } else if (totalGross <= 10000) {
        paye_tax = (totalGross - 4000) * (paye_tax_percentage / 100);
      } else {
        paye_tax = (totalGross - 10000) * 0.30 + (6000 * 0.25); // Example, you may need to refine
      }

      // NAPSA Contributions (5% for both employee and employer)
      const napsa_contribution = totalGross * (napsa_contribution_percentage / 100);

      // Total deductions (including new deductions like NHIMA, union dues, etc.)
      const total_deductions =
        paye_tax +
        napsa_contribution +
        union_dues +
        health_insurance +
        nhima_contribution +
        gratuity_severance +
        wcif;

      // Net salary
      const net_salary = totalGross - total_deductions;

      setForm((prevForm) => ({
        ...prevForm,
        total_gross: totalGross,
        paye_tax_amount: paye_tax,
        napsa_contribution_amount: napsa_contribution,
        total_deductions,
        net_salary,
      }));
    };

    calculatePayroll();
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.staff_name || !form.department || !form.role || form.salary <= 0 || !form.payment_date) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Simulate submitting payroll data (this would be an API call)
      console.log("Payroll data submitted:", form);
      alert("Payroll submitted successfully!");
      navigate("/hr/payroll"); // Redirect after submission
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
        <a href="/hr/payroll" className="active">Payroll</a>
        <a href="/hr/leave">Leave Management</a>
        <a href="/hr/leaveApplications">Leave Applications</a>
        <a href="/hr/departments">Departments</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a
          href="/"
          className="logout-link"
          onClick={(e) => {
            e.preventDefault();
            localStorage.clear();
            navigate("/"); // Redirect to login page
          }}
        >
          ➜ Logout
        </a>
      </div>

      {/* Page Content */}
      <div className="dashboard-content">
        <header className="page-header">
          <h1>Payroll Management</h1>
          <div>
            <button className="add-btn" onClick={() => navigate("/hr/payroll", { replace: true })}>← Back</button>
            <button className="hamburger" onClick={toggleSidebar}>☰</button>
          </div>
        </header>

        <div className="container">
          <form className="add-form-styling" onSubmit={handleSubmit}>
            {/* Department, Role, Staff Name */}
            <div className="card">
              <h3>Employee Information</h3>

              <label>Department</label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              >
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>

              <label>Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {roles.map((role, index) => (
                  <option key={index} value={role}>{role}</option>
                ))}
              </select>

              <label>Staff Name</label>
              <select
                value={form.staff_name}
                onChange={(e) => setForm({ ...form, staff_name: e.target.value })}
              >
                {staffNames.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Allowances */}
            <div className="card">
              <h3>Allowances</h3>
              <label>Basic Salary (ZMW)</label>
              <input
                type="number"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
              />

              <label>Housing Allowance (ZMW)</label>
              <input
                type="number"
                value={form.housing_allowance}
                onChange={(e) => setForm({ ...form, housing_allowance: Number(e.target.value) })}
              />

              <label>Transport Allowance (ZMW)</label>
              <input
                type="number"
                value={form.transport_allowance}
                onChange={(e) => setForm({ ...form, transport_allowance: Number(e.target.value) })}
              />

              <label>Medical Allowance (ZMW)</label>
              <input
                type="number"
                value={form.medical_allowance}
                onChange={(e) => setForm({ ...form, medical_allowance: Number(e.target.value) })}
              />

              <label>Overtime (ZMW)</label>
              <input
                type="number"
                value={form.overtime}
                onChange={(e) => setForm({ ...form, overtime: Number(e.target.value) })}
              />

              <label>Bonus (ZMW)</label>
              <input
                type="number"
                value={form.bonus}
                onChange={(e) => setForm({ ...form, bonus: Number(e.target.value) })}
              />
            </div>

            {/* Tax and Deductions */}
            <div className="card">
              <h3>Tax and Deductions</h3>
              <label>PAYE Tax Rate (%)</label>
              <input
                type="number"
                value={form.paye_tax_percentage}
                onChange={(e) => setForm({ ...form, paye_tax_percentage: Number(e.target.value) })}
              />

              <label>PAYE Tax Amount (ZMW)</label>
              <input
                type="number"
                value={form.paye_tax_amount}
                readOnly
              />

              <label>NAPSA Contribution Rate (%)</label>
              <input
                type="number"
                value={form.napsa_contribution_percentage}
                onChange={(e) => setForm({ ...form, napsa_contribution_percentage: Number(e.target.value) })}
              />

              <label>NAPSA Contribution Amount (ZMW)</label>
              <input
                type="number"
                value={form.napsa_contribution_amount}
                readOnly
              />

              <label>Loan Deduction (ZMW)</label>
              <input
                type="number"
                value={form.loan_deduction}
                onChange={(e) => setForm({ ...form, loan_deduction: Number(e.target.value) })}
              />

              <label>Union Dues (ZMW)</label>
              <input
                type="number"
                value={form.union_dues}
                onChange={(e) => setForm({ ...form, union_dues: Number(e.target.value) })}
              />

              <label>Health Insurance (ZMW)</label>
              <input
                type="number"
                value={form.health_insurance}
                onChange={(e) => setForm({ ...form, health_insurance: Number(e.target.value) })}
              />

              <label>NHIMA Contribution (ZMW)</label>
              <input
                type="number"
                value={form.nhima_contribution}
                onChange={(e) => setForm({ ...form, nhima_contribution: Number(e.target.value) })}
              />
            </div>

            {/* Gratuity/Severance and WCIF */}
            <div className="card">
              <h3>Gratuity/Severance Pay and WCIF</h3>
              <label>Gratuity/Severance Pay (ZMW)</label>
              <input
                type="number"
                value={form.gratuity_severance}
                onChange={(e) => setForm({ ...form, gratuity_severance: Number(e.target.value) })}
              />

              <label>Workers' Compensation Fund (WCIF) (ZMW)</label>
              <input
                type="number"
                value={form.wcif}
                onChange={(e) => setForm({ ...form, wcif: Number(e.target.value) })}
              />
            </div>

            {/* Net Salary */}
            <div className="card">
              <h3>Net Salary</h3>
              <label>Total Gross Salary (ZMW)</label>
              <input
                type="number"
                value={form.total_gross}
                readOnly
              />

              <label>Net Salary (ZMW)</label>
              <input
                type="number"
                value={form.net_salary}
                readOnly
              />

              <label>Payment Date</label>
              <input
                type="date"
                value={form.payment_date}
                onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
              />

              <button type="submit" className="add-btn" style={{ marginTop: 20 }}>
                Submit Payroll
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
