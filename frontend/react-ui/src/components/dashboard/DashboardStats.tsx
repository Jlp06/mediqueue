import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Users } from "lucide-react";

interface Token {
    id: number;
    token_number: number;
    department_id: number;
    counter_id: number;
    status: "waiting" | "serving" | "completed";
    created_at: string;
    department_name?: string;
}

interface Stats {
    total: number;
    pending: number;
    completed: number;
    avgWait: string;
}

export default function DashboardStats() {
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pending: 0,
        completed: 0,
        avgWait: "—",
    });

    useEffect(() => {
        const fetchStats = async () => {
            const res = await api.get("/api/tokens");
            const tokens = res.data;

            const total = tokens.length;
            const pending = tokens.filter(
                (t: Token) => t.status === "waiting" || t.status === "serving"
            ).length;
            const completed = tokens.filter(
                (t: Token) => t.status === "completed"
            ).length;

            // Calculate avg wait time in minutes for completed tokens
            const completedTokens = tokens.filter((t: Token) => t.status === "completed");
            let avgWait = "—";
            if (completedTokens.length > 0) {
                const totalMins = completedTokens.reduce((sum: number, t: Token) => {
                    const created = new Date(t.created_at).getTime();
                    const now = Date.now();
                    return sum + Math.round((now - created) / 60000);
                }, 0);
                avgWait = `${Math.round(totalMins / completedTokens.length)} min`;
            }

            setStats({ total, pending, completed, avgWait });
        };

        fetchStats();
    }, []);

    return (
        <div className="stats-grid">
            <div className="stat-card clickable">
                <Users size={20} color="#0b5ed7" />
                <h4>Total Tokens</h4>
                <p>{stats.total}</p>
            </div>
            <div className="stat-card clickable">
                <Users size={20} color="#0b5ed7" />
                <h4>Pending</h4>
                <p>{stats.pending}</p>
            </div>
            <div className="stat-card clickable">
                <Users size={20} color="#0b5ed7" />
                <h4>Completed</h4>
                <p>{stats.completed}</p>
            </div>
            <div className="stat-card clickable">
                <Users size={20} color="#0b5ed7" />
                <h4>Avg Wait</h4>
                <p>{stats.avgWait}</p>
            </div>
        </div>
    );
}