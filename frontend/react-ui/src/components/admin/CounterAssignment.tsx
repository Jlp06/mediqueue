import { useEffect, useState } from "react";
import api from "../../utils/axios";
import type { QueueItem } from "../../types";

export default function CounterAssignment() {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [nowServing, setNowServing] = useState<{
        token: number;
        counter: string;
    } | null>(null);

    const fetchQueue = async () => {
        try {
            const res = await api.get("/api/tokens");
            setQueue(res.data.filter((t: QueueItem) => t.status === "waiting"));
        } catch (error) {
            console.error("Failed to fetch queue", error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, []);

    const assignNext = async () => {
        setLoading(true);
        try {
            const res = await api.post("/api/tokens/serve-next");
            if (res.data.token_number) {
                setNowServing({
                    token: res.data.token_number,
                    counter: res.data.counter,
                });
            }
            await fetchQueue();
        } catch (error) {
            console.error("Failed to serve next", error);
        }
        setLoading(false);
    };

    const nextToken = queue[0];

    return (
        <div className="card">
            <h3>Assign Next Token</h3>

            {nextToken ? (
                <>
                    <p>Next Token: <b>#{nextToken.token_number}</b></p>
                    <p className="muted">Department: {nextToken.department_name || "General"}</p>

                    <button disabled={loading} onClick={assignNext}>
                        {loading ? "Assigning..." : "Assign & Serve"}
                    </button>

                    {nowServing && (
                        <p className="success" style={{ marginTop: "10px" }}>
                            Now serving Token #{nowServing.token} at {nowServing.counter}
                        </p>
                    )}
                </>
            ) : (
                <p className="muted">Queue is empty</p>
            )}
        </div>
    );
}