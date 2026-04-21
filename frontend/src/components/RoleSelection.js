export default function RoleSelection({ onSelect }) {
  return (
    <div className="container">
      <h2>Select Your Role</h2>

      <button onClick={() => onSelect("Student")}>Student</button>
      <button onClick={() => onSelect("Trainer")}>Trainer</button>
      <button onClick={() => onSelect("Institution")}>Institution</button>
      <button onClick={() => onSelect("Programme Manager")}>Programme Manager</button>
      <button onClick={() => onSelect("Monitoring Officer")}>Monitoring Officer</button>
    </div>
  );
}