import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";

export default function TrainerDashboard() {
  const { getToken } = useAuth();

  const [sessionMsg, setSessionMsg] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [batchMsg, setBatchMsg] = useState("");
  const [batchData, setBatchData] = useState(null);
  const [batchName, setBatchName] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [batchId, setBatchId] = useState("");
  const [viewSessionId, setViewSessionId] = useState("");

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
      batchId: Number(batchId),
    }),
  });

  const data = await res.json();

  if (res.ok) {
    setSessionMsg("Session created successfully");
    setTitle("");
    setDate("");
    setBatchId("");
  } else {
    setSessionMsg(data.message);
  }
};




const viewAttendance = async () => {
  const token = await getToken();

  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/api/users/sessions/${viewSessionId}/attendance`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    body: JSON.stringify({
      name: batchName,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    setBatchMsg("Batch created successfully");
    setBatchData(data);
    setBatchName("");
  } else {
    setBatchMsg(data.message);
  }
};





  return (
    <div>
      <h2>Trainer Dashboard</h2>
      <br/>
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

<input
  type="number"
  placeholder="Batch ID"
  value={batchId}
  onChange={(e) => setBatchId(e.target.value)}
/>

<button onClick={createSession}>Create Session</button>

{sessionMsg && <p>{sessionMsg}</p>}

      <br /><br />

      <h3>Create Batch</h3>
    <input
        type="text"
        placeholder="Enter batch name"
        value={batchName}
        onChange={(e) => setBatchName(e.target.value)}
          />
         <button onClick={createBatch}>Create</button>


         {batchMsg && <p>{batchMsg}</p>}

       {batchData && (
         <div>
           <p>Batch Name: {batchData.name}</p>
           <p>Invite Code: {batchData.invite_code}</p>
         </div>
       )}


      <br /><br />

      <h3>View Attendance</h3>

<input
  type="number"
  placeholder="Enter Session ID"
  value={viewSessionId}
  onChange={(e) => setViewSessionId(e.target.value)}
/>

<button onClick={viewAttendance}>View</button>

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