import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

// Interfaces for Program
interface Program {
  program_id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  agenda: string;
  status: string;
  category_id: number;
}

interface Category {
  category_id: number;
  name: string;
}

const RegisteredProgramsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, _setCategories] = useState<Category[]>([
    { category_id: 1, name: "Life Events" },
    { category_id: 2, name: "Church Business Events" },
    { category_id: 3, name: "Community Events" },
    { category_id: 4, name: "Spiritual Events" },
  ]);

  const [showVenueColumn, _setShowVenueColumn] = useState(true); // Example toggle for column visibility

  // Static data for programs (as backend is under construction)
  useEffect(() => {
    const fetchedPrograms: Program[] = [
      {
        program_id: 1,
        title: "Marriage Counseling",
        date: "2025-12-15",
        time: "10:00 AM",
        venue: "Church Hall",
        agenda: "Marriage strengthening and relationship advice",
        status: "Upcoming",
        category_id: 1,
      },
      {
        program_id: 2,
        title: "Church Annual Meeting",
        date: "2025-12-20",
        time: "2:00 PM",
        venue: "Conference Room",
        agenda: "Review of yearly performance and future goals",
        status: "Scheduled",
        category_id: 2,
      },
      {
        program_id: 3,
        title: "Community Outreach Program",
        date: "2025-12-10",
        time: "9:00 AM",
        venue: "Local Park",
        agenda: "Providing food and supplies to the underprivileged",
        status: "Completed",
        category_id: 3,
      },
      {
        program_id: 4,
        title: "Spiritual Retreat",
        date: "2025-12-05",
        time: "All day",
        venue: "Mountain Retreat Center",
        agenda: "Spiritual renewal and meditation",
        status: "Upcoming",
        category_id: 4,
      },
    ];
    setPrograms(fetchedPrograms);
  }, []);

  // Group programs by category
  const groupByCategory = (programs: Program[]) => {
    return programs.reduce((acc: Record<string, Program[]>, program) => {
      const category = program.category_id.toString();
      if (!acc[category]) acc[category] = [];
      acc[category].push(program);
      return acc;
    }, {});
  };

  const groupedPrograms = useMemo(() => groupByCategory(programs), [programs]);

  // Action Handlers
  const handleAddProgram = () => {
    navigate("/programs/addPrograms");
  };

  const handleEditProgram = (id: string) => {
    navigate(`/programs/edit/${id}`);
  };

  const handleDeleteProgram = (id: string) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      setPrograms((prev) => prev.filter((program) => program.program_id !== Number(id)));
    }
  };

  const handleViewProgram = (id: string) => {
    // Construct URL for viewProgram page
    const url = `/programs/viewProgram?id=${id}`;
    // Open in a new tab
    window.open(url, "_blank");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
        &#9776;
      </button>

      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`} id="sidebar">
        <div className="close-wrapper">
          <div className="toggle close-btn">
            <input
              type="checkbox"
              id="closeSidebarButton"
              checked={sidebarOpen}
              onChange={() => setSidebarOpen(!sidebarOpen)}
            />
            <span className="button"></span>
            <span className="label">X</span>
          </div>
        </div>

        <h2>PROGRAM MANAGER</h2>
        <a href="/programs/dashboard">Dashboard</a>
        <a href="/programs/registered" className="active">
          Registered Programs
        </a>
        <a href="/programs/categories">Categories</a>

        <hr className="sidebar-separator" />
        <a href="/dashboard" className="return-main">
          ← Back to Main Dashboard
        </a>
        <a
          href="/"
          className="logout-link"
          onClick={(e) => {
            e.preventDefault();
            localStorage.clear();
            navigate("/");
          }}
        >
          ➜] Logout
        </a>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Registered Programs</h1>

        {/* Add Program Button */}
        <div
          className="table-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <button className="add-btn" onClick={handleAddProgram}>
            + &nbsp; Add New Program
          </button>
        </div>

        {/* Program Tables Grouped by Category */}
        {Object.keys(groupedPrograms).map((categoryId) => {
          const categoryName = categories.find(
            (cat) => cat.category_id === Number(categoryId)
          )?.name;
          return (
            <div key={categoryId}>
              <h2>{categoryName}</h2>
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Time</th>
                    {showVenueColumn && <th>Venue</th>}
                    <th>Agenda</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedPrograms[categoryId].map((program) => (
                    <tr key={program.program_id}>
                      <td data-title="Title">{program.title}</td>
                      <td data-title="Date">{program.date}</td>
                      <td data-title="Time">{program.time}</td>
                      {showVenueColumn && <td data-title="Venue">{program.venue}</td>}
                      <td data-title="Agenda">{program.agenda}</td>
                      <td data-title="Status">{program.status}</td>
                      <td className="actions" data-title="Actions">
                        <button
                          className="view-btn"
                          onClick={() => handleViewProgram(program.program_id.toString())}
                        >
                          View
                        </button>&nbsp;
                        <button
                          className="edit-btn"
                          onClick={() => handleEditProgram(program.program_id.toString())}
                        >
                          Edit
                        </button>&nbsp;
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteProgram(program.program_id.toString())}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegisteredProgramsPage;
