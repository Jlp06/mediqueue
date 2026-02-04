import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import type { User } from "../types";

interface Props {
    setUser: (user: User) => void;
    defaultMode?: "login" | "register";
}

export default function Auth({ setUser, defaultMode = "login" }: Props) {
    const [isLogin, setIsLogin] = useState(defaultMode === "login");

    useEffect(() => {
        setIsLogin(defaultMode === "login");
    }, [defaultMode]);

    return (
        <div className="card">
            {isLogin ? (
                <>
                    <Login setUser={setUser} />
                    <p>
                        Don’t have an account?{" "}
                        <span className="link" onClick={() => setIsLogin(false)}>
                            Register
                        </span>
                    </p>
                </>
            ) : (
                <>
                    <Register setUser={setUser} />
                    <p>
                        Already have an account?{" "}
                        <span className="link" onClick={() => setIsLogin(true)}>
                            Login
                        </span>
                    </p>
                </>
            )}
        </div>
    );
}
