import { useEffect, useState } from "react";
import api from "../utils/axios";
import { io } from "socket.io-client";

const socket = io("https://mediqueue-backend-wbxy.onrender.com");

interface Token {
    token_number: number;
    status: string;
    counter_name?: string;
}

export default function DisplayBoard() {
    const [tokens, setTokens] = useState<Token[]>([]);

    useEffect(() => {
        const loadTokens = async () => {
            const res = await api.get("/api/tokens");
            setTokens(res.data);
        };

        loadTokens();

        socket.on("tokenUpdate", () => {
            console.log("Real-time update received");
            loadTokens();
        });

        return () => {
            socket.off("tokenUpdate");
        };
    }, []);

    const current = tokens.find(t => t.status === "serving");
    const nextTokens = tokens.filter(t => t.status === "waiting").slice(0, 5);

    return (
        <div className="display-screen">
            <h1>MediQueue Live Display</h1>

            <div className="now-serving-big">
                <h2>NOW SERVING</h2>
                {current ? (
                    <h1 className="big-token">
                        Token {current.token_number}
                    </h1>
                ) : (
                    <h2>Waiting...</h2>
                )}
            </div>

            <h2>Next Tokens</h2>
            <div className="token-row">
                {nextTokens.map(t => (
                    <span key={t.token_number} className="next-token">
                        {t.token_number}
                    </span>
                ))}
            </div>
        </div>
    );
}