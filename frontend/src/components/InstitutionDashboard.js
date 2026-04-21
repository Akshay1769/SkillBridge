import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import "./index.css";

export default function InstitutionDashboard() {
  const { getToken } = useAuth();

  const [batchId, setBatchId] = useState("");
  const [summary, setSummary] = useState([]);
  const [batches, setBatches] = useState([]);

  const fetchBatches = async () => {
    const token = await getToken();

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/batches`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setBatches(data);
  };

  const fetchSummary = async () => {
    const token = await getToken();

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/users/batches/${batchId}/summary`,
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
      <h2>Institution Dashboard</h2>

      <button onClick={fetchBatches}>View All Batches</button>

      {batches.length > 0 && (
        <div>
          <h4>Batches:</h4>
          {batches.map((b) => (
            <p key={b.id}>
              {b.name} | Code: {b.invite_code}
            </p>
          ))}
        </div>
      )}

      <h3>Batch Summary</h3>

      <input
        type="number"
        placeholder="Enter Batch ID"
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
      />

      <button onClick={fetchSummary}>View Summary</button>

      {summary.length > 0 && (
        <div>
          <h4>Sessions:</h4>
          {summary.map((s) => (
            <p key={s.id}>
              {s.title} | Date: {s.date}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}