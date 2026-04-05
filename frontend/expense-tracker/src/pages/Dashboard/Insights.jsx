import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import "./Insights.css";

const Insights = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");

    // On mount, show any previously generated insights from dashboard
    useEffect(() => {
        const loadExisting = async () => {
            try {
                const { data } = await axiosInstance.get("/user/dashboard");
                // insights aren't on dashboard — just clear the loader
            } catch {
                // silent
            } finally {
                setFetching(false);
            }
        };
        loadExisting();
    }, []);

    const handleGenerate = async () => {
        setError("");
        setLoading(true);
        try {
            const { data } = await axiosInstance.post("/user/insights");
            setInsights(data.insights || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate insights.");
        } finally {
            setLoading(false);
        }
    };

    const getInsightStyle = (message) => {
        const msg = message.toLowerCase();
        if (msg.includes("exceeded") || msg.includes("over") || msg.includes("consuming"))
            return "danger";
        if (msg.includes("nearing") || msg.includes("only") || msg.includes("low"))
            return "warning";
        if (msg.includes("great") || msg.includes("maintained") || msg.includes("balanced"))
            return "success";
        return "info";
    };

    const getInsightIcon = (type) => {
        if (type === "danger") return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
        );
        if (type === "warning") return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
        );
        if (type === "success") return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        );
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
        );
    };

    return (
        <DashboardLayout>
            {/* Topbar */}
            <div className="ins-topbar">
                <div>
                    <h1 className="ins-title">AI Insights</h1>
                    <p className="ins-sub">Personalised financial suggestions based on your activity</p>
                </div>
                <button
                    className="generate-insights-btn"
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner" />
                            Analysing...
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            Generate Insights
                        </>
                    )}
                </button>
            </div>

            <div className="ins-content">
                {/* How it works info */}
                <div className="ins-info-banner">
                    <div className="ins-info-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    </div>
                    <div>
                        <p className="ins-info-title">How insights work</p>
                        <p className="ins-info-text">
                            FinTrack analyses your last 3 months of transactions — savings rate,
                            top spending categories, income patterns — and generates personalised
                            suggestions. Click Generate Insights to get started.
                        </p>
                    </div>
                </div>

                {/* Error */}
                {error && <div className="ins-error">{error}</div>}

                {/* Empty state */}
                {!loading && insights.length === 0 && !error && (
                    <div className="ins-empty">
                        <div className="ins-empty-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </div>
                        <p>No insights yet.</p>
                        <p className="ins-empty-hint">
                            Add at least a few transactions first, then click Generate Insights above.
                        </p>
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="ins-skeleton-list">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="ins-skeleton" />
                        ))}
                    </div>
                )}

                {/* Insights list */}
                {!loading && insights.length > 0 && (
                    <>
                        <div className="ins-header-row">
                            <span className="ins-count">{insights.length} insight{insights.length > 1 ? "s" : ""} generated</span>
                            <button className="regenerate-btn" onClick={handleGenerate}>
                                Regenerate
                            </button>
                        </div>
                        <div className="ins-list">
                            {insights.map((insight, i) => {
                                const type = getInsightStyle(insight.message);
                                return (
                                    <div key={insight._id || i} className={`ins-card ${type}`}>
                                        <div className={`ins-card-icon ${type}`}>
                                            {getInsightIcon(type)}
                                        </div>
                                        <div className="ins-card-body">
                                            <p className="ins-card-message">{insight.message}</p>
                                            {insight.createdAt && (
                                                <span className="ins-card-time">
                                                    {new Date(insight.createdAt).toLocaleString("en-IN", {
                                                        day: "numeric", month: "short",
                                                        hour: "2-digit", minute: "2-digit",
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Insights;
