import { useClerk } from "@clerk/clerk-react";

export default function Navbar({ role }) {
  const { signOut } = useClerk();

  return (
    <div style={styles.nav}>
      <h2 style={styles.logo}>SkillBridge</h2>

      <div style={styles.right}>
        <span>{role}</span>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#4f46e5",
    color: "white",
  },
  logo: {
    margin: 0,
  },
  right: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
};