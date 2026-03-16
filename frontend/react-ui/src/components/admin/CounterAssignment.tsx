import { useEffect, useState } from "react";
import api from "../../utils/axios";
import type { QueueItem } from "../../types";

interface Counter {
    id: number;
    name: string;
    department_id: number;
}

interface Department {
    id: number;
    name: string;
}

export default function CounterAssignment() {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [counters, setCounters] = useState<Counter[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedCounter, setSelectedCounter] = useState<number | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
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

    const fetchDepartmentsAndCounters = async () => {
        try {
            const [deptRes, counterRes] = await Promise.all([
                api.get("/api/departments"),
                api.get("/api/counters"),
            ]);
            setDepartments(deptRes.data);
            setCounters(counterRes.data);
        } catch (error) {
            console.error("Failed to fetch departments/counters", error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchQueue();
        fetchDepartmentsAndCounters();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, []);

    // Filter counters based on selected department
    const filteredCounters = selectedDepartment
        ? counters.filter((c) => c.department_id === selectedDepartment)
        : counters;

    const assignNext = async () => {
        if (!selectedCounter) return alert("Please select a counter");

        setLoading(true);
        try {
            const res = await api.post("/api/tokens/serve-next", {
                counter_id: selectedCounter,
            });
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

                    <select
                        value={selectedDepartment ?? ""}
                        onChange={(e) => {
                            setSelectedDepartment(Number(e.target.value));
                            setSelectedCounter(null);
                        }}
                        style={{ marginBottom: "8px", display: "block", width: "100%" }}
                    >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedCounter ?? ""}
                        onChange={(e) => setSelectedCounter(Number(e.target.value))}
                        style={{ marginBottom: "8px", display: "block", width: "100%" }}
                        disabled={!selectedDepartment}
                    >
                        <option value="">Select Counter</option>
                        {filteredCounters.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <button disabled={loading || !selectedCounter} onClick={assignNext}>
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