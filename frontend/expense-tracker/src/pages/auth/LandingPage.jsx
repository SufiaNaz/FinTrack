import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ fontFamily: "Poppins, sans-serif", minHeight: "100vh", background: "#0f172a", color: "#f1f5f9" }}>
            {/* Navbar */}
            <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 2.5rem", borderBottom: "1px solid #1e293b" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: "#10b981", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>₹</span>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 600 }}>FinTrack</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => navigate("/login")} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #334155", background: "transparent", color: "#f1f5f9", fontSize: 14, cursor: "pointer" }}>Log in</button>
                    <button onClick={() => navigate("/signup")} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>Get started</button>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ textAlign: "center", padding: "5rem 2rem 3rem", maxWidth: 640, margin: "0 auto" }}>
                <div style={{ display: "inline-block", background: "#064e3b", color: "#6ee7b7", fontSize: 12, padding: "4px 14px", borderRadius: 20, marginBottom: "1.5rem" }}>Personal Finance, Simplified</div>
                <h1 style={{ fontSize: 42, fontWeight: 600, lineHeight: 1.2, marginBottom: "1rem" }}>
                    Track every rupee,<br /><span style={{ color: "#10b981" }}>grow every goal</span>
                </h1>
                <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.7, marginBottom: "2rem" }}>
                    FinTrack gives you a clear picture of your finances — budgets, transactions, reports, and AI-powered insights, all in one place.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    <button onClick={() => navigate("/signup")} style={{ padding: "12px 28px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontSize: 15, cursor: "pointer", fontWeight: 600 }}>Start for free</button>
                    <button onClick={() => navigate("/login")} style={{ padding: "12px 28px", borderRadius: 8, border: "1px solid #334155", background: "transparent", color: "#f1f5f9", fontSize: 15, cursor: "pointer" }}>Log in</button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;