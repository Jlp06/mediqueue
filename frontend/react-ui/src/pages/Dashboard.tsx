import { useEffect, useState } from "react";
import DashboardStats from "../components/dashboard/DashboardStats";
import Queue from "../components/Queue";
import AdminPanel from "../components/AdminPanel";
import CounterAssignment from "../components/admin/CounterAssignment";
import type { User } from "../types";
import api from "../utils/axios";

export default function Dashboard({ user }: { user: User }) {

    const [myToken, setMyToken] = useState<number | null>(null);
    const [aheadCount, setAheadCount] = useState<number>(0);

    useEffect(() => {
        if (user.role === "user") {
            fetchMyToken();
        }
    }, []);

    const fetchMyToken = async () => {
        const res = await api.get("/queue/my-token");
        setMyToken(res.data.token_number);
        setAheadCount(res.data.ahead);
    };

    return (
        <>
            {/* Stats Cards */}
            <DashboardStats />

            {/* ⭐ PATIENT TOKEN CARD */}
            {user.role === "user" && (
                <div className="my-token-card">
                    <h3>🎟 Your Token</h3>
                    <p className="token-number">#{myToken}</p>
                    <p>👥 People ahead of you: <b>{aheadCount}</b></p>
                    <p className="muted">Please wait for your turn</p>
                </div>
            )}

            {/* Live Queue */}
            <Queue user={user} />

            {/* Admin Panel */}
            {user.role === "admin" ? (
                <>
                    <AdminPanel />
                    <CounterAssignment />
                </>
            ) : (
                <p className="muted">
                    Please wait for your token to be called.
                </p>
            )}
        </>
    );
}
