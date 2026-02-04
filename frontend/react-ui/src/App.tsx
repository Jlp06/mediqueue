import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/Home";
import type { User } from "./types";
import { useEffect } from "react";
import GlassLogin from "./pages/GlassLogin";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Tokens from "./pages/Tokens";
import Departments from "./pages/Departments";
import Counters from "./pages/Counters";
import DisplayBoard from "./pages/DisplayBoard";
import DepartmentAnalytics from "./pages/DepartmentAnalytics";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload as User);
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<Home setUser={setUser} />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={user ? <DashboardLayout user={user} onLogout={logout} /> : <Navigate to="/" />}
      >
        <Route index element={<Dashboard user={user} />} />

        {user?.role === "admin" && (
          <>
            <Route path="departments" element={<Departments />} />
            <Route path="counters" element={<Counters />} />
            <Route path="tokens" element={<Tokens />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<DepartmentAnalytics />} />
          </>
        )}
      </Route>

      <Route path="/glass-login" element={<GlassLogin setUser={setUser} />} />
      <Route path="/display" element={<DisplayBoard />} />
    </Routes>
  );
}

export default App;
