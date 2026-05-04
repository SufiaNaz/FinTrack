import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./signup.css";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const fullName = e.target.name.value.trim();
        const phone = e.target.phone.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        // Client-side validation
        if (fullName.length < 3) return setError("Name must be at least 3 characters");
        if (!/^\d{10}$/.test(phone)) return setError("Phone number must be exactly 10 digits");
        if (!email.includes("@") || !email.includes(".")) return setError("Enter a valid email");
        if (password.length < 6) return setError("Password must be at least 6 characters");

        setLoading(true);
        try {
            await register(fullName, phone, email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <header className="signup-top-text">
                    <div className="signup-logo" aria-hidden>
                        <svg viewBox="0 0 64 64" className="signup-logo-svg" role="img" aria-label="FinTrack logo">
                            <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.06)" />
                            <path d="M16 38 L28 24 L36 34 L48 18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="signup-title-text">
                        <h1>Create Your Account</h1>
                        <p>Fill in details to continue</p>
                    </div>
                </header>

                <div className="signup-form-area">
                    {/* Error message */}
                    {error && (
                        <div className="signup-auth-error" role="alert">
                            {error}
                        </div>
                    )}

                    <form className="signup-form" onSubmit={handleSubmit} aria-label="signup form">
                        <ul className="signup-wrapper" role="list">
                            <li style={{ "--i": 5 }}>
                                <span className="signup-icon" aria-hidden>
                                    <svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z" fill="currentColor" /></svg>
                                </span>
                                <input className="signup-input" type="text" placeholder="Full Name" name="name" required aria-label="Full Name" />
                            </li>

                            <li style={{ "--i": 4 }}>
                                <span className="signup-icon" aria-hidden>
                                    <svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" fill="currentColor" /></svg>
                                </span>
                                <input className="signup-input" type="tel" placeholder="Phone Number" name="phone" required aria-label="Phone Number" />
                            </li>

                            <li style={{ "--i": 3 }}>
                                <span className="signup-icon" aria-hidden>
                                    <svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" fill="currentColor" /></svg>
                                </span>
                                <input className="signup-input" type="email" placeholder="E-mail" required name="email" aria-label="E-mail" />
                            </li>

                            <li style={{ "--i": 2, position: "relative" }}>
                                <span className="signup-icon" aria-hidden>
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3H9z" fill="currentColor" />
                                    </svg>
                                </span>
                                <input
                                    className="signup-input"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    required
                                    name="password"
                                    aria-label="Password"
                                />
                                <span className="signup-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" fill="currentColor" /></svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24"><path d="M12 5c-2.1 0-4 .6-5.7 1.6L3 3 1.6 4.4 19.6 22.4 21 21l-3-3c2.2-1.5 4-4 4-4s-4-7-11-7zm-7.4 4.2C6.1 6.8 8.9 6 12 6c4.4 0 7.6 2.9 9.5 5-1 1.2-2.6 3.2-4.8 4.7L6.1 7.7c-.7.5-1.3 1-1.9 1.5z" fill="currentColor" /></svg>
                                    )}
                                </span>
                            </li>

                            <li style={{ "--i": 1 }}>
                                <button type="submit" className="signup-submit-btn" disabled={loading}>
                                    {loading ? "CREATING ACCOUNT..." : "SIGNUP"}
                                </button>
                            </li>
                        </ul>
                    </form>
                </div>

                <footer className="signup-footer">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </footer>
            </div>
        </div>
    );
};

export default SignUp;
