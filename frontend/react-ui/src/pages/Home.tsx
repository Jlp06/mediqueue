import { Link } from "react-router-dom";
import type { User } from "../types";
import { useState } from "react";
import LoginModal from "../components/LoginModal";
import AnimatedCounter from "../components/AnimatedCounter";
import heroImage from "../assets/patient_with_phone.jpg";
interface Props {
    setUser: (user: User) => void;
}

export default function Home({ setUser }: Props) {
    const token = localStorage.getItem("token");
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className="landing">

            {/* NAVBAR */}
            <nav className="navbar">
                <h2>MediQueue</h2>

                <div className="nav-buttons">
                    {token ? (
                        <Link to="/dashboard">
                            <button className="btn-primary small-btn">Dashboard</button>
                        </Link>
                    ) : (
                        <>
                            <button
                                className="btn-primary small-btn"
                                onClick={() => setShowLogin(true)}
                            >
                                Login
                            </button>

                            <button
                                className="btn-secondary small-btn"
                                onClick={() => setShowLogin(true)}
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="hero-modern">

                <div className="hero-overlay"></div>

                <img
                    className="hero-bg-image"
                    src={heroImage}
                    alt="patient tracking queue"
                />

                <div className="hero-content">

                    <span className="hero-badge">Patient Queue Made Simple</span>

                    <h1>
                        Track Your Hospital Queue{" "}
                        <span className="highlight">From Anywhere</span>
                    </h1>

                    <p>
                        Get a digital token, monitor your position in real time, and avoid
                        long waiting lines at the hospital.
                    </p>

                    <div className="hero-buttons">
                        {token ? (
                            <Link to="/dashboard">
                                <button className="btn-primary big">
                                    View My Queue
                                </button>
                            </Link>
                        ) : (
                            <button
                                className="btn-primary big"
                                onClick={() => setShowLogin(true)}
                            >
                                Patient Login
                            </button>
                        )}

                        <Link to="/dashboard">
                            <button className="btn-secondary">
                                Track Queue Status
                            </button>
                        </Link>
                    </div>

                </div>

            </section>
            
            {/* STATS SECTION */}
            <section className="stats-section">
                <div className="stats-container">

                    <div className="stat-box">
                        <h3>
                            <AnimatedCounter end={1250} />+
                        </h3>
                        <p>Patients Served</p>
                    </div>

                    <div className="stat-box">
                        <h3>
                            <AnimatedCounter end={8} />
                        </h3>
                        <p>Departments</p>
                    </div>

                    <div className="stat-box">
                        <h3>
                            <AnimatedCounter end={5} />
                        </h3>
                        <p>Active Queues</p>
                    </div>

                    <div className="stat-box">
                        <h3>
                            <AnimatedCounter end={12} />
                            <span> min</span>
                        </h3>
                        <p>Avg Wait Time</p>
                    </div>

                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="how-it-works">
                <h2>How MediQueue Works</h2>

                <div className="steps">

                    <div className="step-card">
                        <h3>1. Register / Login</h3>
                        <p>
                            Patients and hospital staff securely login to access the smart queue system.
                        </p>
                    </div>

                    <div className="step-card">
                        <h3>2. Join Queue</h3>
                        <p>
                            Patients select department and receive a digital token instantly.
                        </p>
                    </div>

                    <div className="step-card">
                        <h3>3. Track in Real-Time</h3>
                        <p>
                            View live queue progress and get notified when your turn arrives.
                        </p>
                    </div>

                </div>
            </section>

            {/* FEATURES */}
            <section className="features">
                <div className="feature-card">
                    <h3>⏱ Real-Time Queue</h3>
                    <p>
                        Patients can track their token live from anywhere without
                        waiting in long physical lines.
                    </p>
                </div>

                <div className="feature-card">
                    <h3>👨‍⚕️ Admin Dashboard</h3>
                    <p>
                        Hospital admins manage counters, departments, and queue flow
                        from a single system.
                    </p>
                </div>

                <div className="feature-card">
                    <h3>📊 Reports & Analytics</h3>
                    <p>
                        Generate detailed PDF/CSV reports to analyze hospital
                        performance and waiting time.
                    </p>
                </div>
            </section>

            {/* TRUST BAR */}
            <section className="trust">
                <p>
                    Trusted by modern clinics and hospitals to reduce waiting time and improve patient experience.
                </p>
            </section>

            {/* CTA SECTION */}
            <section className="cta">
                <h2>Ready to Transform Patient Queues?</h2>
                <p>Start using MediQueue and reduce waiting time today.</p>

                <button
                    className="btn-primary big"
                    onClick={() => setShowLogin(true)}
                >
                    Get Started Now
                </button>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <p>© 2026 MediQueue | Built by Labanti 🚀</p>
            </footer>

            <LoginModal
                open={showLogin}
                onClose={() => setShowLogin(false)}
                setUser={setUser}
            />
        </div>
    );
}
