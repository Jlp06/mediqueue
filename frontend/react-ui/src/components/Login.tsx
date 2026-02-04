import { useState } from "react";
import axios from "axios";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
    setUser: (user: User) => void;
}

export default function Login({ setUser }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const loginUser = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axios.post("http://localhost:5000/api/login", {
                email,
                password,
            });
            localStorage.setItem("token", res.data.token);

            setUser(res.data.user);
            navigate("/dashboard");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Login failed");
            } else {
                setError("Something went wrong");
            }
        }finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Login</h2>

            {error && <p className="error">{error}</p>}

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

            <button onClick={loginUser} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
    );
}