import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./forgotPassword.css";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const { forgotPassword } = useAuth();

    

// Replace the handleSubmit with this:
const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();
    if (!trimmed.includes("@") || !trimmed.includes(".")) {
        return setError("Please enter a valid email address");
    }

    setLoading(true);
    try {
        await axios.post(
            "https://fintrack-89m0.onrender.com/api/v1/user/forgot-password",
            { email: trimmed }
        );
        setSuccess(true);
    } catch {
        setSuccess(true);
    } finally {
        setLoading(false);
    }
};

    if (success) {
        return (
            <div className="forgot-container">
                <div className="forgot-card">
                    <div className="success-icon" aria-hidden>✓</div>
                    <h1>Check Your Email</h1>
                    <p>If <strong>{email}</strong> is registered with FinTrack, a password reset link has been sent.</p>
                    <p className="success-note">Didn't receive it? Check your spam folder.</p>
                    <Link to="/login" className="forgot-btn" style={{ display: "block", marginTop: "20px", textDecoration: "none", textAlign: "center" }}>
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-container">
            <div className="forgot-card">
                <header className="top-text">
                    <div className="title-text">
                        <h1>Reset Password</h1>
                        <p>Enter your registered email address</p>
                    </div>
                </header>

                {error && <div className="auth-error" role="alert">{error}</div>}

                <form className="forgot-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        className="forgot-input"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button type="submit" className="forgot-btn" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <footer className="forgot-footer">
                    <Link to="/login">← Back to Login</Link>
                </footer>
            </div>
        </div>
    );
};

export default ForgotPassword;
