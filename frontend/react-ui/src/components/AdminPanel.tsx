import { useEffect, useState } from "react";
import api from "../utils/axios";
import type { QueueItem } from "../types";

export default function AdminPanel() {
    const [queue, setQueue] = useState<QueueItem[]>([]);

    const fetchQueue = async () => {
        const res = await api.get("/api/tokens");
        // Only show waiting and serving tokens
        setQueue(res.data.filter((t: QueueItem) => t.status === "waiting" || t.status === "serving"));
    };

    const serveNext = async () => {
        await api.post("/api/tokens/serve-next");
        fetchQueue();
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card">
            <h2>Admin Panel</h2>

            <button onClick={serveNext} disabled={queue.length === 0}>
                Serve Next Patient
            </button>

            <ul className="queue-list">
                {queue.map((q) => (
                    <li key={q.id}>
                        Token #{q.token_number}
                        {q.status === "serving" && <strong> — Now Serving</strong>}
                    </li>
                ))}
            </ul>
        </div>
    );
}