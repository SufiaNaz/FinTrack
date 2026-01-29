import React, { useState } from "react";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (password !== confirm) {
      return alert("Passwords do not match");
    }

    alert("Password reset successfully!");
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h1>Set New Password</h1>
        <p>Enter your new password below</p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="New password"
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            name="confirm"
            placeholder="Confirm password"
            required
          />

          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
