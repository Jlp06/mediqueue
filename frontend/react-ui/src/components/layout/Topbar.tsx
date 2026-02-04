import type { User } from "../../types";
import { useNavigate } from "react-router-dom";


interface Props {
    user: User;
    onLogout: () => void;
}

export default function Topbar({ user, onLogout }: Props) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        onLogout();
        navigate("/");

    };

    return (
        <header className="topbar">
            <span>
                Welcome, <b>{user.name}</b>

                {user.role && (
                    <small style={{ marginLeft: 8, color: "#6b7280" }}>
                        ({user.role})
                    </small>
                )}
            </span>

            <button onClick={handleLogout}>Logout</button>
        </header>
    );
}
