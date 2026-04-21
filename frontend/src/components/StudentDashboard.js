import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import "./index.css";

export default function StudentDashboard() {
  const { getToken } = useAuth();

  const [attendanceMsg, setAttendanceMsg] = useState("");
  const [joinMsg, setJoinMsg] = useState("");
  const [batchData, setBatchData] = useState(null);
  const [inviteCode, setInviteCode] = useState("");

  const markAttendance = async () => {
    const token = await getToken();

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sessionId: 1,
        status: "present",
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setAttendanceMsg("Attendance marked successfully");
    } else {
      setAttendanceMsg(data.message);
    }
  };

  const joinBatch = async () => {
    const token = await getToken();

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/batches/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        inviteCode,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setJoinMsg("Joined batch successfully");
      setBatchData(data.batch);
      setInviteCode("");
    } else {
      setJoinMsg(data.message);
    }
  };

  return (
    <div className="container">
      <h2>Student Dashboard</h2>

      <button onClick={markAttendance}>Mark Attendance</button>
      {attendanceMsg && <p>{attendanceMsg}</p>}

      <br /><br />

        <div className="section">
        <h3>Join Batch</h3> 
        
      
      <input
        type="text"
        placeholder="Enter invite code"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
      />
      <button onClick={joinBatch}>Join</button>
        </div>
      {joinMsg && <p>{joinMsg}</p>}

      {batchData && (
        <div className="card">
          <p>Batch Name: {batchData.name}</p>
          <p>Invite Code: {batchData.invite_code}</p>
        </div>
      )}
    </div>
  );
}