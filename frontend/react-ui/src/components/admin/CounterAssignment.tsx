import { useEffect, useState } from "react";
import api from "../../utils/axios";

interface Token {
    token_number: number;
}

const counters = [
    { id: 1, name: "Counter 1" },
    { id: 2, name: "Counter 2" },
    { id: 3, name: "Counter 3" },
];

export default function CounterAssignment() {
    const [queue, setQueue] = useState<Token[]>([]);
    const [selectedCounter, setSelectedCounter] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    
    const [nowServing, setNowServing] = useState<{
        token: number;
        counter: number;
    } | null>(null);

    const fetchQueue = async () => {
        try {
            console.log("Fetching queue...");
            const res = await api.get("/queue");

            console.log("Queue response:", res.data);
            setQueue(res.data);
        } catch (error) {
            console.error("Failed to fetch queue", error);
            alert("Failed to fetch queue. Check backend.");
        }
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const assignNext = async () => {
        if (!selectedCounter) return alert("Select a counter");

        setLoading(true);
        const res = await api.post("/queue/next");

        setNowServing({
            token: res.data.served.token_number,
            counter: selectedCounter,
        });

        await fetchQueue();
        setLoading(false);
    };

    const nextToken = queue[0];

    return (
        <div className="card">
            <h3>Assign Next Token</h3>

            {nextToken ? (
                <>
                    <p>
                        Next Token: <b>#{nextToken.token_number}</b>
                    </p>

                    <select
                        value={selectedCounter ?? ""}
                        onChange={(e) => setSelectedCounter(Number(e.target.value))}
                    >
                        <option value="">Select Counter</option>
                        {counters.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <button disabled={loading} onClick={assignNext}>
                        Assign & Serve
                    </button>
                    
                    {nowServing && (
                        <p className="success" style={{ marginTop: "10px" }}>
                            Now serving Token #{nowServing.token} at Counter {nowServing.counter}
                        </p>
                    )}
                </>
            ) : (
                <p className="muted">Queue is empty</p>
            )}
        </div>
    );
}
