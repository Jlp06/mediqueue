import { useEffect, useState } from "react";
import api from "../utils/axios";
import type { QueueItem } from "../types";

export default function AdminPanel() {
    const [queue, setQueue] = useState<QueueItem[]>([]);

    const serveNext = async () => {
            await api.post("http://localhost:5000/api/queue/next");

        const res = await api.get("http://localhost:5000/api/queue", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
            setQueue(res.data);
    };

    useEffect(() => {
        const loadQueue = async () => {
            const res = await api.get("http://localhost:5000/api/queue", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setQueue(res.data);
        };

        loadQueue();
        const interval = setInterval(loadQueue, 5000);

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
                    <li key={q.token_number}>
                        Token #{q.token_number}
                    </li>
                ))}
            </ul>
        </div>
    );
}
