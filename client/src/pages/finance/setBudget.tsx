import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/global.css";

interface BudgetCategories {
  [category: string]: string[];
}

interface Budgets {
  [category: string]: { [subCategory: string]: number };
}

const SetBudgetsPage: React.FC = () => {
  const navigate = useNavigate();

  // ---------------- Sidebar State ----------------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [sidebarOpen]);

  // ---------------- Budget Categories ----------------
  const [budgetCategories, setBudgetCategories] = useState<{ [category: string]: string[] }>({});
  const [categoryIds, setCategoryIds] = useState<{ [category: string]: number }>({}); // To store category_id
  const [subcategoryIds, setSubcategoryIds] = useState<{ [subCategory: string]: number }>({}); // To store subcategory_id

  // ---------------- Budget State ----------------
  const [budgets, setBudgets] = useState<Budgets>({});
  const [selectedMonth, setSelectedMonth] = useState<string>("01"); // Default to January
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString()); // Default to current year

  // ---------------- Fetch Categories and Existing Budgets ----------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/finance/expense_categories");
        const categories: { [category: string]: string[] } = {};
        const categoryIdsMap: { [category: string]: number } = {};
        
        res.data.forEach((category: any) => {
          categories[category.name] = []; // Initialize empty array for subcategories
          categoryIdsMap[category.name] = category.id; // Store category_id
        });

        // Fetch expense subcategories and group by category
        const subCategoriesRes = await axios.get("http://localhost:3000/api/finance/expense_subcategories");
        
        const subcategoryIdsMap: { [subCategory: string]: number } = {};
        subCategoriesRes.data.forEach((subCategory: any) => {
          const categoryName = res.data.find((cat: any) => cat.id === subCategory.category_id)?.name;
          if (categoryName) {
            categories[categoryName].push(subCategory.name);
            subcategoryIdsMap[subCategory.name] = subCategory.id; // Map subcategory name to ID
          }
        });

        setBudgetCategories(categories);
        setCategoryIds(categoryIdsMap); // Set the category_id map
        setSubcategoryIds(subcategoryIdsMap); // Set the subcategory_id map

        // Fetch existing budgets
        const budgetsRes = await axios.get("http://localhost:3000/api/finance/budgets");
        const initialBudgets: Budgets = {};
        
        // Initialize budgets if they exist
        budgetsRes.data.forEach((budget: any) => {
          const category = categories[budget.category];
          if (!initialBudgets[category]) {
            initialBudgets[category] = {};
          }
          initialBudgets[category][budget.subCategory] = budget.amount;
        });

        setBudgets(initialBudgets);

      } catch (err) {
        console.error("Error fetching data", err);
        alert("Error fetching data. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  // ---------------- Handle Input Change ----------------
  const handleChange = (category: string, subCategory: string, value: string) => {
    setBudgets(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: parseFloat(value) || 0
      }
    }));
  };

  // ---------------- Handle Month Change ----------------
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  // ---------------- Handle Year Change ----------------
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  // ---------------- Save Budgets ----------------
  const saveBudgets = async () => {
    try {
      // Flatten the data into an array of objects
      const dataToSave = [];

      // Iterate over each category and subcategory to flatten the structure
      for (const category in budgets) {
        if (category !== 'month' && category !== 'year') {
          for (const subCategory in budgets[category]) {
            const amount = budgets[category][subCategory];

            // Only include entries with valid amounts
            if (amount !== undefined && !isNaN(amount) && amount > 0) {
              // Mapping category_id and subcategory_id
              const categoryId = categoryIds[category]; // Get category_id from the categoryIds map
              const subcategoryId = subcategoryIds[subCategory]; // Get subcategory_id from the subcategoryIds map

              dataToSave.push({
                title: subCategory,  // Title is the subcategory name
                amount,
                year: parseInt(selectedYear, 10),
                month: parseInt(selectedMonth, 10),
                category_id: categoryId,  // Send the category_id
                expense_subcategory_id: subcategoryId, // Send the subcategory_id
                income_subcategory_id: null, // Assuming this is not used for budgets, adjust as needed
              });
            }
          }
        }
      }

      // Validate that there's data to send
      if (dataToSave.length === 0) {
        alert("No valid budget data to save.");
        return;
      }

      console.log("Data to save:", dataToSave);  // Log data to confirm the structure

      // Make the POST request to save the budgets
      const response = await axios.post("http://localhost:3000/api/finance/budgets", dataToSave);

      console.log("Response from backend:", response.data); // Log the response

      alert("Budgets have been saved successfully!");
    } catch (err) {
      console.error("Failed to save budgets:", err);

      if (err.response) {
        console.error("Error response:", err.response.data);
      }

      alert("Error saving budgets. Please try again.");
    }
  };

  // ---------------- Generate Year Options ----------------
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    let years = [];
    for (let i = currentYear; i <= currentYear + 5; i++) {
      years.push(i.toString());
    }
    return years;
  };

  return (
    <div className="dashboard-wrapper">
      {/* Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>

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

        <h2>FINANCE</h2>
        <a href="/finance/dashboard">Dashboard</a>
        <a href="/finance/incometracker">Track Income</a>
        <a href="/finance/expensetracker">Track Expenses</a>
        <a href="/finance/budgets" className="active">Budget</a>
        <a href="/finance/payroll">Payroll</a>
        <a href="/finance/financeCategory">Finance Categories</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">← Back to Main Dashboard</a>
        <a href="/" className="logout-link" onClick={(e) => { e.preventDefault(); localStorage.clear(); navigate("/"); }}>➜ Logout</a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content container">
        <header>
          <h1>Budget Setup</h1>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button className="add-btn" onClick={() => navigate("/finance/expensetracker")}>
              Expenses
            </button>
            <button className="add-btn" onClick={() => navigate("/finance/incometracker")}>
              Income
            </button>
          </div>
        </header>

        <br />

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button className="add-btn" onClick={() => navigate("/finance/budgets")}>
            Budget Summary
          </button>
        </div>

        <h2>Set Budget for Categories</h2>

        {/* Month and Year Dropdowns */}
        <div style={{ marginBottom: "20px" }}>
          <label>Select Month: </label>
          <select value={selectedMonth} onChange={handleMonthChange} style={{ marginRight: "10px" }}>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>

          <label>Select Year: </label>
          <select value={selectedYear} onChange={handleYearChange}>
            {generateYearOptions().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Render Budget Form with Cards */}
        {Object.entries(budgetCategories).map(([category, subCategories]) => (
          <div className="budget-card" key={category}>
            <h3 className="budget-card-title">{category}</h3>

            {subCategories.map(sub => (
              <div className="budget-input-row" key={sub}>
                <label>{sub}</label>
                <input
                  type="number"
                  min={0}
                  placeholder="Enter budget"
                  value={budgets[category]?.[sub] || ""}
                  onChange={(e) => handleChange(category, sub, e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}

        <button className="add-btn" onClick={saveBudgets} style={{ marginTop: "20px" }}>
          Save Budgets
        </button>
      </div>
    </div>
  );
};

export default SetBudgetsPage;
