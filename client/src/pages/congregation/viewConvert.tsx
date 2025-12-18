import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/global.css";

const ViewConvert: React.FC = () => {
  const { id } = useParams(); // Get the id from URL
  const navigate = useNavigate();
  const [convert, setConvert] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch convert details based on the passed id
    const fetchConvert = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/converts/${id}`);
        const data = await response.json();

        if (data) {
          // Handle the 'name' and other details
          let name = "";
          if (data.convert_type === "visitor") {
            const visitorResponse = await fetch(`http://localhost:3000/api/visitor/${data.visitor_id}`);
            const visitor = await visitorResponse.json();
            name = visitor.name;
          } else if (data.convert_type === "member") {
            const memberResponse = await fetch(`http://localhost:3000/api/members/${data.member_id}`);
            const member = await memberResponse.json();
            name = member.full_name;
          }

          setConvert({ ...data, name });
        } else {
          setError("Convert not found.");
        }
      } catch (error) {
        setError("Error fetching convert details.");
        console.error("Error fetching convert details:", error);
      }
    };

    if (id) {
      fetchConvert();
    }
  }, [id]);

  if (error) {
    return (
      <div className="error-message">
        <h3>{error}</h3>
        <button onClick={() => navigate("/congregation/converts")}>Go Back to Converts</button>
      </div>
    );
  }

  if (!convert) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-convert-wrapper">
      <h1>Convert Details</h1>

      <div className="convert-details">
        <table className="responsive-table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{convert.name}</td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{convert.convert_type}</td>
            </tr>
            <tr>
              <td>Convert Date</td>
              <td>{new Date(convert.convert_date).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>Follow-up Status</td>
              <td>{convert.follow_up_status}</td>
            </tr>
            <tr>
              <td>Organization ID</td>
              <td>{convert.organization_id}</td>
            </tr>
          </tbody>
        </table>

        <div className="back-button">
          <button onClick={() => navigate("/congregation/converts")}>Back to Converts</button>
        </div>
      </div>
    </div>
  );
};

export default ViewConvert;
