import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { User } from "../../types";
import { Outlet } from "react-router-dom";

interface Props {
    user: User;
    onLogout: () => void;
}

export default function DashboardLayout({ user, onLogout }: Props) {
    return (
        <div className="dashboard">
            <Sidebar user={user} />

            <div className="dashboard-main">
                <Topbar user={user} onLogout={onLogout} />

                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}


