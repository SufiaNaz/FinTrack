import React from "react";
import "./forgotPassword.css";

const ForgotPassword = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();

    if (!email.includes("@") || !email.includes(".")) {
      return alert("Please enter a valid email address");
    }

    // Dummy success message (TRS-safe)
    alert(
      "If this email is registered, a password reset link has been sent."
    );
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <header className="top-text">
          <div className="title-text">
            <h1>Reset Password</h1>
            <p>Enter your registered email address</p>
          </div>
        </header>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="forgot-input"
            required
          />

          <button type="submit" className="forgot-btn">
            Send Reset Link
          </button>
        </form>

        <footer className="forgot-footer">
          <a href="/login">← Back to Login</a>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPassword;
