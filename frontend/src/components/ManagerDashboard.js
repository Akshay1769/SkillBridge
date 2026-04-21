import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";

export default function ManagerDashboard() {
  const { getToken } = useAuth();

  const [summary, setSummary] = useState([]);

  const fetchProgrammeSummary = async () => {
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
    <div>
      <h2>Programme Manager Dashboard</h2>

      <button onClick={fetchProgrammeSummary}>
        View Programme Summary
      </button>

      {summary.length > 0 && (
        <div>
          <h4>Total Records: {summary.length}</h4>

          {summary.map((a) => (
            <p key={a.id}>
              Session: {a.session_id} | Status: {a.status}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}