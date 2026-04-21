import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import "./index.css";

export default function OfficerDashboard() {
  const { getToken } = useAuth();

  const [summary, setSummary] = useState([]);

  const fetchSummary = async () => {
    const token = await getToken();

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/users/programme/summary`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setSummary(data);
  };

  return (
    <div className="container">
      <h2>Monitoring Officer Dashboard</h2>
      <h4>Read-only access</h4>

      <button onClick={fetchSummary}>View Programme Data</button>

      {summary.length > 0 && (
        <div>
          <h4>Programme Data:</h4>
          {summary.map((a) => (
            <p key={a.id}>
              Session: {a.session_id} | Student: {a.student_id} | Status: {a.status}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}