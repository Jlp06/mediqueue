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
        const loadData = async () => {
            const countersRes = await api.get("/api/counters");
            setCounters(countersRes.data);

            const departmentsRes = await api.get("/api/departments");
            setDepartments(departmentsRes.data);
        };

        loadData();
    }, []);

    const addCounter = async () => {
        if (!name || !deptId) return alert("Fill all fields");

        await api.post("/api/counters", { name, department_id: deptId });

        setName("");

        // reload counters after adding
        const res = await api.get("/api/counters");
        setCounters(res.data);
    };


    const deleteCounter = async (id: number) => {
        await api.delete(`/api/counters/${id}`);

        const res = await api.get("/api/counters");
        setCounters(res.data);
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
                                <button
                                    className="danger-btn"
                                    onClick={() => deleteCounter(c.id)}
                                >
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
