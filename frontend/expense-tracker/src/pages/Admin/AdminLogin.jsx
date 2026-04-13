import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            const { data } = await axiosInstance.post("/admin/login", { email, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            // Manually sync context state
            window.location.href = "/admin"; // force full reload so AuthContext re-initializes
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", fontFamily: "Poppins, sans-serif" }}>
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "2.5rem", width: "100%", maxWidth: 400 }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ width: 40, height: 40, background: "#10b981", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                        <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>₹</span>
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>Admin Login</h1>
                    <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 6 }}>FinTrack Admin Panel</p>
                </div>

                {error && (
                    <div style={{ background: "#450a0a", border: "1px solid #991b1b", color: "#fca5a5", padding: "10px 14px", borderRadius: 8, fontSize: 14, marginBottom: "1rem" }}>
                        {error}
                    </div>
                )}

                <div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ fontSize: 13, color: "#94a3b8", display: "block", marginBottom: 6 }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                        />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ fontSize: 13, color: "#94a3b8", display: "block", marginBottom: 6 }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                        />
                    </div>
                    <button onClick={handleLogin}
                        disabled={loading}
                        style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;