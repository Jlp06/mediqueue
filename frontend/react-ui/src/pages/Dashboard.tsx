import { useEffect, useState } from "react";
import DashboardStats from "../components/dashboard/DashboardStats";
import Queue from "../components/Queue";
import AdminPanel from "../components/AdminPanel";
import CounterAssignment from "../components/admin/CounterAssignment";
import type { User, QueueItem } from "../types";
import api from "../utils/axios";

export default function Dashboard({ user }: { user: User }) {

    const [myToken, setMyToken] = useState<number | null>(null);
    const [aheadCount, setAheadCount] = useState<number>(0);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const res = await api.get("/api/tokens");
                const userToken = res.data.find((t: QueueItem) => t.user_id === user.id);
                if (userToken) {
                    setMyToken(userToken.token_number);
                    const ahead = res.data.filter(
                        (t: QueueItem) => t.status === "waiting" && t.token_number < userToken.token_number
                    ).length;
                    setAheadCount(ahead);
                }
            } catch (err) {
                console.error("Failed to load token", err);
            }
        };

        if (user.role === "user") {
            loadToken();
            const interval = setInterval(loadToken, 5000);
            return () => clearInterval(interval);
        }
    }, [user]);

    return (
        <>
            <DashboardStats />

            {user.role === "user" && (
                <div className="my-token-card">
                    <h3>🎟 Your Token</h3>
                    <p className="token-number">#{myToken}</p>
                    <p>👥 People ahead of you: <b>{aheadCount}</b></p>
                    <p className="muted">Please wait for your turn</p>
                </div>
            )}

            <Queue user={user} />

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
