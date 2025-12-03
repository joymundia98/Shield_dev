import React, { useEffect, useRef, useMemo, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import "../../styles/global.css";

interface IncomeCategory {
  id: number;
  name: string;
}

interface IncomeSubcategory {
  id: number;
  category_id: number;
  name: string;
}

interface Income {
  id: number;
  subcategory_id: number;
  giver: string | null;
  amount: string; // stored as string in DB
  status: "Approved" | "Pending" | "Rejected";
}

const IncomeDashboard: React.FC = () => {
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const sourceChartRef = useRef<HTMLCanvasElement>(null);

  const [categories, setCategories] = useState<IncomeCategory[]>([]);
  const [subcategories, setSubcategories] = useState<IncomeSubcategory[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  // ---------------- Fetch Data from Backend ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes, incomeRes] = await Promise.all([
          axios.get("http://localhost:3000/api/finance/income_categories"),
          axios.get("http://localhost:3000/api/finance/income_subcategories"),
          axios.get("http://localhost:3000/api/finance/incomes")
        ]);

        setCategories(catRes.data);
        setSubcategories(subRes.data);
        setIncomes(incomeRes.data);
      } catch (err) {
        console.error("Failed to fetch income data", err);
      }
    };

    fetchData();
  }, []);

  // ---------------- Join incomes with categories ----------------
  const incomesWithCategory = useMemo(() => {
    const subMap = Object.fromEntries(subcategories.map(s => [s.id, s]));
    const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

    return incomes.map(i => {
      const sub = subMap[i.subcategory_id];
      const cat = sub ? catMap[sub.category_id] : null;
      return {
        ...i,
        categoryName: cat ? cat.name : "Unknown",
        subcategoryName: sub ? sub.name : "Unknown",
        amountNum: parseFloat(i.amount)
      };
    });
  }, [incomes, subcategories, categories]);

  // ---------------- Calculate KPIs ----------------
  const { totalApproved, totalPending, totalRejected } = useMemo(() => {
    const totalApproved = incomesWithCategory
      .filter(i => i.status === "Approved")
      .reduce((sum, i) => sum + i.amountNum, 0);
    const totalPending = incomesWithCategory
      .filter(i => i.status === "Pending")
      .reduce((sum, i) => sum + i.amountNum, 0);
    const totalRejected = incomesWithCategory
      .filter(i => i.status === "Rejected")
      .reduce((sum, i) => sum + i.amountNum, 0);

    return { totalApproved, totalPending, totalRejected };
  }, [incomesWithCategory]);

  // ---------------- Prepare Chart Data ----------------
  const { categoryTotals, sourceTotals } = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    const sourceTotals: Record<string, number> = {};

    incomesWithCategory.forEach(i => {
      categoryTotals[i.categoryName] = (categoryTotals[i.categoryName] || 0) + i.amountNum;
      const giver = i.giver || "Anonymous";
      sourceTotals[giver] = (sourceTotals[giver] || 0) + i.amountNum;
    });

    return { categoryTotals, sourceTotals };
  }, [incomesWithCategory]);

  // ---------------- Initialize Charts ----------------
  useEffect(() => {
    let categoryChart: Chart | null = null;
    let sourceChart: Chart | null = null;

    if (categoryChartRef.current) {
      categoryChart = new Chart(categoryChartRef.current, {
        type: "bar",
        data: {
          labels: Object.keys(categoryTotals),
          datasets: [
            { label: "Income", data: Object.values(categoryTotals), backgroundColor: "#1A3D7C" }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    if (sourceChartRef.current) {
      sourceChart = new Chart(sourceChartRef.current, {
        type: "pie",
        data: {
          labels: Object.keys(sourceTotals),
          datasets: [
            {
              data: Object.values(sourceTotals),
              backgroundColor: ["#5C4736", "#817E7A", "#AF907A", "#20262C", "#858796"]
            }
          ]
        },
        options: { responsive: true }
      });
    }

    return () => {
      categoryChart?.destroy();
      sourceChart?.destroy();
    };
  }, [categoryTotals, sourceTotals]);

  return (
    <div className="container">
      <header>
        <h1>Income Dashboard</h1>
        <br /><br />
        <button className="add-btn" onClick={() => window.location.href = "/finance/incometracker"}>
          ← Back to Income Tracker
        </button>
        <button className="hamburger" onClick={() => { /* sidebar toggle */ }}>&#9776;</button>
      </header>

      <br /><br />
      <div className="kpi-container">
        <div className="kpi-card">
          <h3>Total Approved Income</h3>
          <p>${totalApproved.toLocaleString()}</p>
        </div>
        <div className="kpi-card">
          <h3>Pending Income</h3>
          <p>${totalPending.toLocaleString()}</p>
        </div>
        <div className="kpi-card">
          <h3>Rejected Income</h3>
          <p>${totalRejected.toLocaleString()}</p>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-box">
          <h3>Income by Category</h3>
          <canvas ref={categoryChartRef}></canvas>
        </div>
        <div className="chart-box">
          <h3>Income by Source</h3>
          <canvas ref={sourceChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default IncomeDashboard;
