import { useEffect, useState } from "react";
import api from "../utils/axios";

interface Token {
    id: number;
    token_number: number;
    status: string;
    department_name: string;
    counter_name?: string;
}

export default function Tokens() {
    const [tokens, setTokens] = useState<Token[]>([]);

    const fetchTokens = async () => {
        const res = await api.get("/tokens");
        setTokens(res.data);
    };

    useEffect(() => {
        fetchTokens();
    }, []);

    const serveNext = async () => {
        const res = await api.post("/tokens/serve-next");

        if (res.data.message) {
            alert(res.data.message);
        }

        fetchTokens();
    };

    const completeToken = async (id: number) => {
        await api.post(`/tokens/complete/${id}`);
        fetchTokens();
    };

    // Find currently serving token
    const current = tokens.find(t => t.status === "serving");

    return (
        <div>
            <h2>Token Queue</h2>

            <button onClick={serveNext}>Serve Next Token</button>

            {/* NOW SERVING PANEL */}
            {current && (
                <div className="now-serving-card">
                    <h2>🚨 Now Serving</h2>
                    <h1>Token #{current.token_number}</h1>
                    <p>Department: {current.department_name}</p>
                </div>
            )}

            {/* TOKEN TABLE */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Token</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {tokens.map(t => (
                        <tr key={t.id}>
                            <td>#{t.token_number}</td>
                            <td>{t.department_name}</td>
                            <td>
                                <span className={`badge ${t.status}`}>
                                    {t.status}
                                </span>
                            </td>
                            <td>
                                {t.status === "serving" && (
                                    <button onClick={() => completeToken(t.id)}>
                                        Complete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
