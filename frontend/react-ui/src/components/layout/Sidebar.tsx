import { NavLink } from "react-router-dom";
import type { User } from "../../types";

export default function Sidebar({ user }: { user: User }) {
    return (
        <aside className="sidebar">
            <h2 className="logo">MediQueue</h2>

            <nav>
                {/* Dashboard Home */}
                <NavLink to="/dashboard" end>Dashboard</NavLink>

                {/* Admin Links */}
                {user.role === "admin" && (
                    <>
                        <NavLink to="/dashboard/departments">Departments</NavLink>
                        <NavLink to="/dashboard/counters">Counters</NavLink>
                        <NavLink to="/dashboard/tokens">Tokens</NavLink>
                        <NavLink to="/dashboard/reports">Reports</NavLink>
                        <NavLink to="/dashboard/analytics">Analytics</NavLink>
                    </>
                )}
            </nav>
        </aside>
    );
}
