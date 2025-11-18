import React from 'react';
import './login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        {/* Top text */}
        <div className="top-text">
          <h2>Welcome to FinTrack</h2>
          <p>Please login to continue</p>
        </div>

        {/* Skewed 3D form */}
        <form className="form">
          <ul className="wrapper">
            <li style={{ "--i": 4 }}>
              <input className="input" type="text" placeholder="Name" required />
            </li>
            <li style={{ "--i": 3 }}>
              <input className="input" type="text" placeholder="Phone number" required name="phone" />
            </li>
            <li style={{ "--i": 2 }}>
              <input className="input" type="email" placeholder="E-mail" required name="email" />
            </li>
            <li style={{ "--i": 1 }}>
              <button type="submit">Submit</button>
            </li>
          </ul>
        </form>

        {/* Bottom text */}
        <div className="bottom-text">
          <p>Don't have an account? <span className="signup-link">Sign Up</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
