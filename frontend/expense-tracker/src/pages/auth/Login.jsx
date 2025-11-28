import React, { useState } from "react";
import "./login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    // VALIDATION
    if (name.length < 3) return alert("Name must be at least 3 characters");
    if (!email.includes("@") || !email.includes("."))
      return alert("Enter a valid email");
    if (password.length < 6)
      return alert("Password must be at least 6 characters");

    alert("Form submitted successfully!");
  };

  return (
    <div className="login-container">
      {/* glass card that holds everything */}
      <div className="login-card">
        {/* header/title + small logo */}
        <header className="top-text">
          <div className="logo" aria-hidden>
            {/* simple inline SVG logo */}
            <svg viewBox="0 0 64 64" className="logo-svg" role="img" aria-label="FinTrack logo">
              <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.06)"/>
              <path d="M16 38 L28 24 L36 34 L48 18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="title-text">
            <h1>Welcome to FinTrack</h1>
            <p>Please login to continue</p>
          </div>
        </header>

      <div className="form-area">
        {/* 3D skewed form */}
        <form className="form" onSubmit={handleSubmit} aria-label="login form">
        <ul className="wrapper" role="list">
  <li style={{ "--i": 4 }}>
    <span className="icon" aria-hidden>
      {/* user icon */}
      <svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z" fill="currentColor"/></svg>
    </span>
    <input className="input" type="text" placeholder="Name" name="name" required aria-label="Name" />
  </li>

  <li style={{ "--i": 3 }}>
    <span className="icon" aria-hidden>
      {/* email icon */}
      <svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
    </span>
    <input className="input" type="email" placeholder="E-mail" required name="email" aria-label="E-mail" />
  </li>

  <li style={{ "--i": 2, position: "relative" }}>
  <span className="icon" aria-hidden>
    {/* lock icon */}
    <svg viewBox="0 0 24 24">
      <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3H9z" fill="currentColor"/>
    </svg>
  </span>

  <input
    className="input"
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    required
    name="password"
    aria-label="Password"
  />

  {/* Show/Hide Icon */}
  <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? (
      // eye open
      <svg viewBox="0 0 24 24">
        <path
          d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
          fill="currentColor"
        />
      </svg>
    ) : (
      // eye slash
      <svg viewBox="0 0 24 24">
        <path
          d="M12 5c-2.1 0-4 .6-5.7 1.6L3 3 1.6 4.4 19.6 22.4 21 21l-3-3c2.2-1.5 4-4 4-4s-4-7-11-7zm-7.4 4.2C6.1 6.8 8.9 6 12 6c4.4 0 7.6 2.9 9.5 5-1 1.2-2.6 3.2-4.8 4.7L6.1 7.7c-.7.5-1.3 1-1.9 1.5z"
          fill="currentColor"
        />
      </svg>
    )}
  </span>
</li>



  <li style={{ "--i": 1 }}>
    <button type="submit" className="submit-btn">LOGIN</button>
  </li>
</ul>

        </form>
        </div>
        {/* small footer text */}
        <footer className="login-footer">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
