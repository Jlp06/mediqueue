import { useEffect, useState } from "react";
import api from "../utils/axios";

interface Counter {
    id: number;
    name: string;
    department_name: string;
}

interface Department {
    id: number;
    name: string;
}

export default function Counters() {
    const [counters, setCounters] = useState<Counter[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [name, setName] = useState("");
    const [deptId, setDeptId] = useState<number | null>(null);

    useEffect(() => {
        fetchCounters();
        fetchDepartments();
    }, []);

    const fetchCounters = async () => {
        const res = await api.get("/counters");
        setCounters(res.data);
    };

    const fetchDepartments = async () => {
        const res = await api.get("/departments");
        setDepartments(res.data);
    };

    const addCounter = async () => {
        if (!name || !deptId) return alert("Fill all fields");
        await api.post("/counters", { name, department_id: deptId });
        setName("");
        fetchCounters();
    };

    const deleteCounter = async (id: number) => {
        await api.delete(`/counters/${id}`);
        fetchCounters();
    };

    return (
        <div>
            <h2>Counters</h2>

            <div className="card" style={{ marginBottom: "1rem" }}>
                <input
                    placeholder="Counter Name (e.g. Counter 1)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <select onChange={(e) => setDeptId(Number(e.target.value))}>
                    <option>Select Department</option>
                    {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>

                <button onClick={addCounter}>Add Counter</button>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Counter</th>
                        <th>Department</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {counters.map(c => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.department_name}</td>
                            <td>
                                <button className="danger-btn" onClick={() => deleteCounter(c.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
