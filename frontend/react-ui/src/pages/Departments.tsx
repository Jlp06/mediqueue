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

    const fetchDepartments = async () => {
        const res = await api.get("/departments");
        setDepartments(res.data);
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const addDepartment = async (dep: any) => {
        const res = await api.post("/departments", dep);
        setDepartments([res.data, ...departments]);
    };

    const deleteDepartment = async (id: number) => {
        await api.delete(`/departments/${id}`);
        setDepartments(departments.filter(d => d.id !== id));
    };

    return (
        <div>
            <div className="page-header">
                <h2>Departments</h2>
                <button onClick={() => setShowModal(true)}>Add Department</button>
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

                        <button className="danger-btn" onClick={() => deleteDepartment(dep.id)}>
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
