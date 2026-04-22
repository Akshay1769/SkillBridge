import { useClerk } from "@clerk/clerk-react";

export default function Navbar({ role }) {
  const { signOut } = useClerk();

  return (
    <div className="navbar">
      <div className="nav-left">SkillBridge</div>

      <div className="nav-right">
        <span>{role}</span>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    </div>
  );
}