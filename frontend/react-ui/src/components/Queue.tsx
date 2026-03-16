import { useEffect, useState } from "react";
import api from "../utils/axios";
import type { User, QueueItem } from "../types";

interface Props {
    user: User;
}

export default function Queue({ user }: Props) {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [success, setSuccess] = useState("");

    const generateToken = async () => {
        try {
            await api.post("/api/tokens/generate", {
                department_id: 1,
                user_id: user.id,
            });
            setSuccess("Token generated successfully 🎉");
            fetchQueue();
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            // optional: error handling later
        }
    };

    const fetchQueue = async () => {
        const res = await api.get("/api/tokens", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        setQueue(res.data);
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const userToken = queue.find(q => q.user_id === user.id);
    const hasToken = !!userToken;
    const nowServingToken = queue.find(q => q.status === "serving");
    const tokensAhead = userToken
        ? queue.filter(q => q.status === "waiting" && q.token_number < userToken.token_number)
        : [];

    return (
        <div className="card">
            <h2>Live Queue</h2>
            <p className="muted">Auto-refreshes every 5 seconds</p>

            {success && <p className="success">{success}</p>}

            <button onClick={generateToken} disabled={hasToken}>
                {hasToken ? "Token Already Generated" : "Generate Token"}
            </button>

            {nowServingToken && (
                <div style={{
                    background: "#0b5ed7",
                    color: "white",
                    borderRadius: "8px",
                    padding: "12px",
                    textAlign: "center",
                    margin: "12px 0"
                }}>
                    <p style={{ margin: 0, fontSize: "0.85rem" }}>🔔 Now Serving</p>
                    <h2 style={{ margin: "4px 0" }}>Token #{nowServingToken.token_number}</h2>
                    {nowServingToken.counter_name && (
                        <p style={{ margin: 0, fontSize: "0.85rem" }}>
                            at {nowServingToken.counter_name}
                        </p>
                    )}
                </div>
            )}

            {userToken ? (
                <>
                    <p className="status">
                        Your Token: <b>#{userToken.token_number}</b><br />
                        People ahead of you: <b>{tokensAhead.length}</b>
                    </p>
                    {tokensAhead.length === 0 ? (
                        <p style={{ color: "green", fontWeight: "bold" }}>
                            🎉 You're next!
                        </p>
                    ) : (
                        <ul className="queue-list">
                            {tokensAhead.map((q) => (
                                <li key={q.id}>Token #{q.token_number}</li>
                            ))}
                        </ul>
                    )}
                </>
            ) : (
                queue.filter(q => q.status === "waiting").length === 0 && (
                    <>
                        <h3>No patients in queue</h3>
                        <p>The queue is currently empty.</p>
                    </>
                )
            )}
        </div>
    );
}