import { useClerk } from "@clerk/clerk-react";

export default function Navbar() {
  const { signOut } = useClerk();

  return (
    <div className="navbar">
      <div className="nav-left">SkillBridge</div>

      <div className="nav-right">
        <button onClick={() => signOut()}>Logout</button>
      </div>
    </div>
  );
}