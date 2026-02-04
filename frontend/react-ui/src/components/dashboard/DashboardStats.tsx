import { useEffect, useState } from "react";
import api from "../../utils/axios";
import type { QueueItem } from "../../types";
import { Users } from "lucide-react";

export default function DashboardStats() {
    const [queue, setQueue] = useState<QueueItem[]>([]);

    useEffect(() => {
        const fetchQueue = async () => {
            const res = await api.get("/queue");

            setQueue(res.data);
        };

        fetchQueue();
    }, []);

    const total = queue.length;
    const pending = queue.length; // later we’ll separate statuses
    const served = 0; // placeholder for now

    return (
        <div className="stats-grid">
            <div className="stat-card clickable">
                <Users size={20} color="#0b5ed7" />
                <h4>Total Tokens</h4>
                <p>{total}</p>
            </div>

            <div className="stat-card clickable">
                <Users size={20} color="#0b5ed7" />
                <h4>Pending</h4>
                <p>{pending}</p>
            </div>

            <div className="stat-card clickable">
                <Users size={20} color="#0b5ed7" />
                <h4>Completed</h4>
                <p>{served}</p>
            </div>

            <div className="stat-card clickable">
                <Users size={20} color="#0b5ed7" />
                <h4>Avg Wait</h4>
                <p>—</p>
            </div>
        </div>
    );
}
