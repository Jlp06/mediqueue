import { useEffect, useState } from "react";
import api from "../utils/axios";
import type { User, QueueItem } from "../types";

interface Props {
    user: User;
}

interface Department {
    id: number;
    name: string;
}

export default function Queue({ user }: Props) {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [success, setSuccess] = useState("");
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDept, setSelectedDept] = useState<number>(1);

    const fetchQueue = async () => {
        const res = await api.get("/api/tokens", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        setQueue(res.data);
    };

    const fetchDepartments = async () => {
        try {
            const res = await api.get("/api/departments");
            setDepartments(res.data);
            if (res.data.length > 0) setSelectedDept(res.data[0].id);
        } catch (err) {
            console.error("Failed to fetch departments", err);
        }
    };

    const generateToken = async () => {
        try {
            await api.post("/api/tokens/generate", {
                department_id: selectedDept,
                user_id: user.id,
            });
            setSuccess("Token generated successfully 🎉");
            fetchQueue();
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            // optional: error handling later
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchQueue();
        fetchDepartments();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, []); 

    const userToken = queue.find(
        q => q.user_id === user.id && q.status !== "completed" && q.department_id === selectedDept
    );
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

            {/* Department selector — only show if no token yet */}
            {!hasToken && (
                <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(Number(e.target.value))}
                    style={{ marginBottom: "8px", display: "block", width: "100%" }}
                >
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            )}

            <button onClick={generateToken} disabled={hasToken}>
                {hasToken ? "Token Already Generated" : "Generate Token"}
            </button>

            {/* Now Serving Banner */}
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
                        Department: <b>{userToken.department_name || "General"}</b><br />
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