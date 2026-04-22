import { useEffect, useState } from "react";
import { useAuth, useUser, SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import StudentDashboard from "./components/StudentDashboard";
import TrainerDashboard from "./components/TrainerDashboard";
import InstitutionDashboard from "./components/InstitutionDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import OfficerDashboard from "./components/OfficerDashboard";
import RoleSelection from "./components/RoleSelection";
import Navbar from "./components/Navbar";

function App() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchUser = async () => {
      const token = await getToken();

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, [isLoaded, isSignedIn, getToken]);

  const handleRoleSelect = async (role) => {
    const token = await getToken();

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/sync-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: clerkUser?.fullName || "User",
        role,
      }),
    });

    const data = await res.json();
    setUser(data);
  };

  function renderDashboard() {
    if (user.role === "Student") return <StudentDashboard />;
    if (user.role === "Trainer") return <TrainerDashboard />;
    if (user.role === "Institution") return <InstitutionDashboard />;
    if (user.role === "Programme Manager") return <ManagerDashboard />;
    if (user.role === "Monitoring Officer") return <OfficerDashboard />;
    return <p>Unknown role</p>;
  }

  return (
    <>
<SignedIn>
  {loading ? (
    <p>Loading...</p>
  ) : !user ? (
    <RoleSelection onSelect={handleRoleSelect} />
  ) : (
    <>
      <Navbar role={user.role} />
      {renderDashboard()}
    </>
  )}
</SignedIn>
    </>
  );
}

export default App;