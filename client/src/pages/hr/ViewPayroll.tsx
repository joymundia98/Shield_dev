import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ViewPayrollPage: React.FC = () => {
  const location = useLocation();
  const { payroll_id } = location.state;

  const [payrollRecord, setPayrollRecord] = useState(null);

  // Fetch the payroll record by payroll_id
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/payroll/${payroll_id}`);
        if (response.ok) {
          const data = await response.json();
          setPayrollRecord(data);
        } else {
          console.error("Failed to fetch payroll record");
        }
      } catch (error) {
        console.error("Error fetching payroll record:", error);
      }
    };

    fetchPayroll();
  }, [payroll_id]);

  if (!payrollRecord) {
    return <p>Loading payroll record...</p>;
  }

  return (
    <div>
      <h1>Payroll Detail</h1>
      <table>
        <tr>
          <th>Staff Name</th>
          <td>{payrollRecord.name}</td>
        </tr>
        <tr>
          <th>Role</th>
          <td>{payrollRecord.role}</td>
        </tr>
        <tr>
          <th>Net Salary</th>
          <td>{payrollRecord.net_salary}</td>
        </tr>
        <tr>
          <th>Status</th>
          <td>{payrollRecord.status}</td>
        </tr>
        <tr>
          <th>Payment Date</th>
          <td>{new Date(payrollRecord.created_at).toLocaleDateString()}</td>
        </tr>
        {/* Add other fields as needed */}
      </table>
    </div>
  );
};

export default ViewPayrollPage;
