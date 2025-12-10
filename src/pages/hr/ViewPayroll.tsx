import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface PayrollRecord {
  name: string;
  position: string;
  salary: number;
  status: string;
  date: string;
  department: string;
}

const ViewPayroll: React.FC = () => {
  const { name } = useParams<{ name: string }>(); // Type for `name` parameter
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch payroll data from API
  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        // Replace this URL with your actual API endpoint
        const response = await axios.get<PayrollRecord[]>("http://localhost:3000/api/payroll");
        setPayrollData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load payroll data.");
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, []);

  // Safely find the payroll record matching the `name` from URL params
  const payrollRecord = payrollData.find(
    (record) => name && record.name.toLowerCase() === name.toLowerCase()
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!payrollRecord) {
    return <div>Payroll record for {name} not found.</div>;
  }

  return (
    <div>
      <h1>View Payroll - {payrollRecord.name}</h1>
      <p>Position: {payrollRecord.position}</p>
      <p>Salary: ${payrollRecord.salary}</p>
      <p>Status: {payrollRecord.status}</p>
      <p>Payment Date: {payrollRecord.date}</p>
      <p>Department: {payrollRecord.department}</p>
      {/* Add any other relevant information */}
    </div>
  );
};

export default ViewPayroll;
