const Payroll: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState<Payroll>({
    staff_id: 0,
    staff_name: "",
    department_id: 0, // Initialize as number, not string
    role_id: 0, // Initialize as number, not string
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

  const [gratuityAmount, setGratuityAmount] = useState<number>(0);
  const [departments, setDepartments] = useState<any[]>([]); // Fetch department data
  const [roles, setRoles] = useState<any[]>([]); // Fetch roles data
  const [staffNames, setStaffNames] = useState<any[]>([]); // Fetch staff data

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  // Fetch departments, roles, and staff names
  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await fetch("http://localhost:3000/api/departments");
      const data = await response.json();
      setDepartments(data);
    };

    const fetchRoles = async () => {
      const response = await fetch("http://localhost:3000/api/roles");
      const data = await response.json();
      setRoles(data);
    };

    const fetchStaffNames = async () => {
      const response = await fetch("http://localhost:3000/api/staff");
      const data = await response.json();
      setStaffNames(data);
    };

    fetchDepartments();
    fetchRoles();
    fetchStaffNames();
  }, []);

  // Simulate fetching staff details
  useEffect(() => {
    const staffData = {
      staff_id: 1,
      staff_name: "John Doe",
      department_id: 1,  // Default department_id
      role_id: 1,  // Default role_id
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

  // Calculate Gratuity Amount when salary or gratuity percentage changes
  useEffect(() => {
    const calculateGratuity = (salary: number, gratuityPercentage: number) => {
      return (salary * gratuityPercentage) / 100;
    };

    const amount = calculateGratuity(form.salary, form.gratuity_severance);
    setGratuityAmount(amount); // Update only when salary or gratuity percentage changes
  }, [form.salary, form.gratuity_severance]);

  useEffect(() => {
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
        wcif,
      } = form;

      // Basic salary and allowances (for gross calculation)
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
        paye_tax = (totalGross - 10000) * 0.30 + (6000 * 0.25); // Example, refine as needed
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
        gratuityAmount + // Add gratuity to deductions
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
  }, [
    form.salary, // Triggers when salary changes
    form.housing_allowance,
    form.transport_allowance,
    form.medical_allowance,
    form.overtime,
    form.bonus,
    form.paye_tax_percentage,
    form.napsa_contribution_percentage,
    form.union_dues,
    form.health_insurance,
    form.nhima_contribution,
    form.wcif,
    gratuityAmount, // Gratuity is now tracked separately
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log the updated form to inspect what will be sent
    console.log("Form Data being sent to backend:", form);

    // Ensure the selected department_id and role_id are valid
    const departmentExists = departments.some(department => department.id === form.department_id);
    if (!departmentExists) {
      alert("Selected department does not exist in the database.");
      return;
    }

    if (form.department_id === 0 || form.role_id === 0) {
      alert("Please select a valid department and role.");
      return;
    }

    // Check if required fields are filled, allowing default values
    if (
      !form.staff_name ||
      form.department_id === 0 || // Ensure department_id is valid (not 0)
      form.role_id === 0 || // Ensure role_id is valid (not 0)
      form.salary <= 0 ||
      !form.payment_date
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Extract the year and month from the payment_date
    const paymentDate = new Date(form.payment_date);
    const year = paymentDate.getFullYear();
    const month = paymentDate.getMonth() + 1; // Months are 0-based, so we add 1

    // Prepare the data for submission (including extracted year, month, and status)
    const updatedForm = {
      ...form,
      year,
      month,
      status: "Pending", // Set the status to "Pending"
    };

    try {
      const response = await fetch("http://localhost:3000/api/payroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedForm),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to submit payroll: ${responseData.message || 'Unknown error'}`);
      }

      alert("Payroll submitted successfully!");
      navigate("/hr/payroll");

    } catch (err: any) {
      console.error("Error occurred while submitting payroll:", err);
      alert("Error: " + (err.message || "Unknown error"));
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
      </div>

      {/* Page Content */}
      <div className="dashboard-content">
        <header className="page-header">
          <h1>Payroll Management</h1>
          <div>
            <button className="add-btn" onClick={() => navigate("/hr/payroll", { replace: true })}>
              ← Back
            </button>
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
                value={form.department_id}
                onChange={(e) => setForm({ ...form, department_id: Number(e.target.value) })}
              >
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name} {/* Display department name */}
                  </option>
                ))}
              </select>

              <label>Role</label>
              <select
                value={form.role_id}
                onChange={(e) => setForm({ ...form, role_id: Number(e.target.value) })}
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>

              <label>Staff Name</label>
              <select
                value={form.staff_id}
                onChange={(e) => setForm({ ...form, staff_id: Number(e.target.value) })}
              >
                {staffNames.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Other Form Sections (Allowances, Deductions, etc.) */}
            {/* ... other sections of the form */}
            
            <button type="submit" className="add-btn" style={{ marginTop: 20 }}>
              Submit Payroll
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
