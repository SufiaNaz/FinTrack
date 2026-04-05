import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./forgotPassword.css";

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const { token } = useParams(); // reads /reset-password/:token from URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const password = e.target.password.value;
        const confirm = e.target.confirm.value;

        if (password.length < 6) return setError("Password must be at least 6 characters");
        if (password !== confirm) return setError("Passwords do not match");

        setLoading(true);
        try {
            await axiosInstance.post(`/user/reset-password/${token}`, { password });
            setSuccess(true);
            // Redirect to login after 2 seconds
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Reset link is invalid or expired. Please request a new one.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="forgot-container">
                <div className="forgot-card">
                    <div className="success-icon" aria-hidden>✓</div>
                    <h1>Password Reset!</h1>
                    <p>Your password has been updated successfully.</p>
                    <p className="success-note">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-container">
            <div className="forgot-card">
                <header className="top-text">
                    <div className="title-text">
                        <h1>Set New Password</h1>
                        <p>Enter your new password below</p>
                    </div>
                </header>

                {error && <div className="auth-error" role="alert">{error}</div>}

                <form onSubmit={handleSubmit} className="forgot-form">
                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="New password"
                            className="forgot-input"
                            required
                            style={{ width: "100%", boxSizing: "border-box" }}
                        />
                    </div>

                    <input
                        type={showPassword ? "text" : "password"}
                        name="confirm"
                        placeholder="Confirm new password"
                        className="forgot-input"
                        required
                    />

                    <label style={{ fontSize: "13px", color: "#575cb5", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />
                        Show passwords
                    </label>

                    <button type="submit" className="forgot-btn" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <footer className="forgot-footer">
                    <Link to="/login">← Back to Login</Link>
                </footer>
            </div>
        </div>
    );
};

export default ResetPassword;
