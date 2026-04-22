import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export default function TrainerDashboard() {
  const { getToken } = useAuth();

  const [sessionMsg, setSessionMsg] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [batchMsg, setBatchMsg] = useState("");
  const [batchData, setBatchData] = useState(null);
  const [batchName, setBatchName] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");

  const fetchBatches = async () => {
    const token = await getToken();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/batches`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setBatches(data);
  };

  const fetchSessions = async () => {
    const token = await getToken();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSessions(data);
  };

  useEffect(() => {
    fetchBatches();
    fetchSessions();
  }, []);

  const createSession = async () => {
    const token = await getToken();

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        date,
        batchId: Number(selectedBatch),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setSessionMsg("Session created successfully");
      setTitle("");
      setDate("");
      setSelectedBatch("");
      fetchSessions();
    } else {
      setSessionMsg(data.message);
    }
  };

  const viewAttendance = async () => {
    const token = await getToken();

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/users/sessions/${selectedSession}/attendance`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setAttendanceList(data);
  };

  const createBatch = async () => {
    const token = await getToken();

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/batches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: batchName }),
    });

    const data = await res.json();

    if (res.ok) {
      setBatchMsg("Batch created successfully");
      setBatchData(data);
      setBatchName("");
      fetchBatches();
    } else {
      setBatchMsg(data.message);
    }
  };

  return (
    <div className="container">
      <h2>Trainer Dashboard</h2>

      <h3>Create Session</h3>

      <input
        type="text"
        placeholder="Session Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select
        value={selectedBatch}
        onChange={(e) => setSelectedBatch(e.target.value)}
      >
        <option value="">Select Batch</option>
        {batches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <button onClick={createSession} disabled={!selectedBatch}>
        Create Session
      </button>

      {sessionMsg && <p>{sessionMsg}</p>}

      <div className="section">
        <h3>Create Batch</h3>

        <input
          type="text"
          placeholder="Enter batch name"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
        />

        <button onClick={createBatch}>Create</button>

        {batchMsg && <p>{batchMsg}</p>}
      </div>

      {batchData && (
        <div className="card">
          <p>Batch Name: {batchData.name}</p>
          <p>Invite Code: {batchData.invite_code}</p>
        </div>
      )}

      <h3>View Attendance</h3>

      <select
        value={selectedSession}
        onChange={(e) => setSelectedSession(e.target.value)}
      >
        <option value="">Select Session</option>
        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title} ({s.date})
          </option>
        ))}
      </select>

      <button onClick={viewAttendance} disabled={!selectedSession}>
        View
      </button>

      {attendanceList.length > 0 && (
        <div>
          <h4>Attendance List:</h4>
          {attendanceList.map((a) => (
            <p key={a.id}>
              Student: {a.student_id} | Status: {a.status}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}