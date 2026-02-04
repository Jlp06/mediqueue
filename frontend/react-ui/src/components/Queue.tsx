import { useEffect, useState } from "react";
import api from "../utils/axios";
import type { User, QueueItem } from "../types";

interface Props {
    user: User;
}

export default function Queue({ user }: Props) {
    const [token, setToken] = useState<number | null>(null);
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [success, setSuccess] = useState("");

    const generateToken = async () => {
        try {
            const res = await api.post("/api/token", {
                user_id: user.id,
            });

            setToken(res.data.token_number);
            setSuccess("Token generated successfully 🎉");
            fetchQueue();

            setTimeout(() => setSuccess(""), 3000);
        } catch {
            // optional: error handling later
        }
    };

    const fetchQueue = async () => {
        const res = await api.get("/api/queue", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        setQueue(res.data);
    };

    useEffect(() => {
        fetchQueue();

        const interval = setInterval(() => {
            fetchQueue();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const userIndex = queue.findIndex(q => q.user_id === user.id);
    const hasToken = userIndex !== -1;
    
    return (
            <div className="card">
                <h2>Live Queue</h2>
                <p className="muted">Auto-refreshes every 5 seconds</p>

                {success && <p className="success">{success}</p>}

                <button onClick={generateToken} disabled={hasToken}>
                    {hasToken ? "Token Already Generated" : "Generate Token"}
                </button>

                {queue.length === 0 ? (
                    <>
                        <h3>No patients in queue</h3>
                        <p>The queue is currently empty.</p>
                    </>
                ) : (
                    <>
                        {token && (
                            <p style={{ textAlign: "center", marginTop: "1rem" }}>
                                Your Token: <strong>{token}</strong>
                            </p>
                        )}

                        {userIndex !== -1 && (
                            <p className="status">
                                Your position in queue: <b>{userIndex + 1}</b><br />
                                People ahead of you: <b>{userIndex}</b>
                            </p>
                        )}

                        <ul className="queue-list">
                            {queue.map((q) => (
                                <li
                                    key={q.token_number}
                                    className={q.user_id === user.id ? "my-token" : ""}
                                >
                                    Token #{q.token_number}
                                    {q.user_id === user.id && " (You)"}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
    );
}
