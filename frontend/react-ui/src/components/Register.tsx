import { useState } from "react";
import api from "../utils/axios";
import type { User } from "../types";

interface Props {
    setUser: (user: User) => void;
}

export default function Register({ setUser }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const registerUser = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await api.post("http://localhost:5000/api/register", {
                name,
                email,
                password,
            });

            setUser(res.data.user);
        } catch (err) {
            if (api.isAxiosError(err)) {
                setError(err.response?.data?.message || "Registration failed");
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Register</h2>

            {error && <p className="error">{error}</p>}

            <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={registerUser} disabled={loading}>
                {loading ? "Creating account..." : "Register"}
            </button>
        </div>
    );
}
