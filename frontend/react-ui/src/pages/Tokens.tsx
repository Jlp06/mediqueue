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

    useEffect(() => {
        const loadTokens = async () => {
            const res = await api.get("/api/tokens");
            setTokens(res.data);
        };

        loadTokens();
    }, []);

    const serveNext = async () => {
        const res = await api.post("/api/tokens/serve-next");

        if (res.data.message) {
            alert(res.data.message);
        }

        const updated = await api.get("/api/tokens");
        setTokens(updated.data);
    };

    const completeToken = async (id: number) => {
        await api.post(`/api/tokens/complete/${id}`);

        const updated = await api.get("/api/tokens");
        setTokens(updated.data);
    };

    const current = tokens.find(t => t.status === "serving");

    return (
        <div>
            <h2>Token Queue</h2>

            <button onClick={serveNext}>Serve Next Token</button>

            {current && (
                <div className="now-serving-card">
                    <h2>🚨 Now Serving</h2>
                    <h1>Token #{current.token_number}</h1>
                    <p>Department: {current.department_name}</p>
                </div>
            )}

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