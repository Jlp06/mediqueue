import { useEffect, useState } from "react";
import api from "../utils/axios";
import AddDepartmentModal from "../components/AddDepartmentModal";

interface Department {
    id: number;
    name: string;
    counters: number;
    doctors: number;
    active: boolean;
}

export default function Departments() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loadDepartments = async () => {
            const res = await api.get("/api/departments");
            setDepartments(res.data);
        };

        loadDepartments();
    }, []);

    const addDepartment = async (dep: Omit<Department, "id">) => {
        const res = await api.post("/api/departments", dep);

        setDepartments(prev => [res.data, ...prev]);
    };

    const deleteDepartment = async (id: number) => {
        await api.delete(`/api/departments/${id}`);

        setDepartments(prev => prev.filter(d => d.id !== id));
    };

    return (
        <div>
            <div className="page-header">
                <h2>Departments</h2>
                <button onClick={() => setShowModal(true)}>
                    Add Department
                </button>
            </div>

            <div className="card-grid">
                {departments.map(dep => (
                    <div key={dep.id} className="dept-card">
                        <h3>{dep.name}</h3>
                        <p>Counters: {dep.counters}</p>
                        <p>Doctors: {dep.doctors}</p>

                        <span className={`badge ${dep.active ? "success" : "danger"}`}>
                            {dep.active ? "Active" : "Inactive"}
                        </span>

                        <button
                            className="danger-btn"
                            onClick={() => deleteDepartment(dep.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            <AddDepartmentModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onAdd={addDepartment}
            />
        </div>
    );
}