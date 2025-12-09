import React from "react";
import { useParams } from "react-router-dom";

const ViewPayroll: React.FC = () => {
  const { name } = useParams();
  
  // Assuming payrollData is available or fetched from an API
  const payrollRecord = payrollData.find(record => record.name === name);

  if (!payrollRecord) {
    return <div>Payroll record not found.</div>;
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
