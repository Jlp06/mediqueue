import { useState } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    onAdd: (dep: any) => void;
}

export default function AddDepartmentModal({ open, onClose, onAdd }: Props) {
    const [name, setName] = useState("");
    const [counters, setCounters] = useState(1);
    const [doctors, setDoctors] = useState(1);

    if (!open) return null;

    const handleSubmit = () => {
        if (!name.trim()) return alert("Enter department name");

        onAdd({
            id: Date.now(),
            name,
            counters,
            doctors,
            waiting: 0,
            active: true,
        });

        setName("");
        setCounters(1);
        setDoctors(1);
        onClose();
    };

    return (
        <div className="modal-overlay1">
            <div className="modal-box1">
                <h3>Add Department</h3>

                <input
                    placeholder="Department Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Counters"
                    value={counters}
                    onChange={(e) => setCounters(Number(e.target.value))}
                />

                <input
                    type="number"
                    placeholder="Doctors"
                    value={doctors}
                    onChange={(e) => setDoctors(Number(e.target.value))}
                />

                <div className="modal-actions">
                    <button onClick={handleSubmit}>Add</button>
                    <button className="danger-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
