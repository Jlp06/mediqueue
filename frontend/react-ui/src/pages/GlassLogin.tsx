import Auth from "../components/Auth";
import type { User } from "../types";

interface Props {
    setUser: (user: User) => void;
}

export default function GlassLogin({ setUser }: Props) {
    return (
        <div className="glass-bg">
            {/* Background blobs */}
            <div className="blob blob1"></div>
            <div className="blob blob2"></div>

            {/* Glass Login Card */}
            <div className="glass-card">
                <h2>MediQueue Login</h2>
                <p>Secure hospital queue management system</p>
                <Auth setUser={setUser} />
            </div>
        </div>
    );
}
