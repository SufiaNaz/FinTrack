import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import "./Budget.css";

const formatINR = (val) =>
    "Rs. " + Number(val).toLocaleString("en-IN");

const getCurrentMonth = () =>
    new Date().toISOString().slice(0, 7);

const getMonthLabel = (monthStr) => {
    const [year, month] = monthStr.split("-");
    return new Date(year, month - 1).toLocaleString("en-IN", {
        month: "long", year: "numeric",
    });
};

const Budget = () => {
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Form
    const [month, setMonth] = useState(getCurrentMonth());
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchBudget = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/user/dashboard");
            setBudget(data.budget);
        } catch {
            setError("Failed to load budget data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBudget(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setSuccess("");

        if (!amount || isNaN(amount) || Number(amount) <= 0)
            return setFormError("Enter a valid budget amount");

        setSubmitting(true);
        try {
            await axiosInstance.post("/user/budget", {
                month,
                amount: Number(amount),
            });
            setSuccess(`Budget set for ${getMonthLabel(month)}`);
            setAmount("");
            fetchBudget();
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to set budget");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!budget) return;
        try {
            await axiosInstance.post("/user/budget/status", {
                month: getCurrentMonth(),
                isActive: !budget.isActive,
            });
            fetchBudget();
        } catch {
            alert("Failed to update budget status");
        }
    };

    const usagePct = budget
        ? Math.min(Math.round((budget.spent / budget.limit) * 100), 100)
        : 0;

    const barColor = usagePct >= 100 ? "#f87171"
        : usagePct >= 80 ? "#fbbf24"
        : "#10b981";

    return (
        <DashboardLayout>
            {/* Topbar */}
            <div className="budget-topbar">
                <div>
                    <h1 className="budget-page-title">Budget</h1>
                    <p className="budget-page-sub">Set and track your monthly spending limit</p>
                </div>
            </div>

            <div className="budget-content">
                <div className="budget-grid">
                    {/* Set Budget Form */}
                    <div className="budget-card">
                        <h2 className="budget-card-title">Set Monthly Budget</h2>
                        <p className="budget-card-sub">
                            Create or update a spending limit for any month.
                        </p>

                        {formError && <div className="budget-error">{formError}</div>}
                        {success && <div className="budget-success">{success}</div>}

                        <form onSubmit={handleSubmit} className="budget-form">
                            <div className="bform-group">
                                <label>Month</label>
                                <input
                                    type="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="bform-group">
                                <label>Budget Limit (Rs.)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="e.g. 20000"
                                    min="1"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="budget-submit-btn"
                                disabled={submitting}
                            >
                                {submitting ? "Saving..." : "Set Budget"}
                            </button>
                        </form>

                        <div className="budget-info-box">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <p>
                                You'll receive an alert notification when your spending reaches
                                80% and 100% of your budget limit.
                            </p>
                        </div>
                    </div>

                    {/* Current Budget Status */}
                    <div className="budget-card">
                        <div className="budget-status-header">
                            <h2 className="budget-card-title">
                                Current Month — {getMonthLabel(getCurrentMonth())}
                            </h2>
                            {budget && (
                                <button
                                    className={`status-toggle ${budget.isActive ? "active" : "inactive"}`}
                                    onClick={handleToggleStatus}
                                >
                                    {budget.isActive ? "Active" : "Paused"}
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="budget-empty">Loading...</div>
                        ) : error ? (
                            <div className="budget-empty error">{error}</div>
                        ) : !budget ? (
                            <div className="budget-empty">
                                <div className="budget-empty-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                    </svg>
                                </div>
                                <p>No budget set for this month.</p>
                                <p className="budget-empty-hint">Use the form to set one.</p>
                            </div>
                        ) : (
                            <>
                                {/* Stats */}
                                <div className="budget-stats-grid">
                                    <div className="budget-stat-item">
                                        <span className="bstat-label">Budget Limit</span>
                                        <span className="bstat-val">{formatINR(budget.limit)}</span>
                                    </div>
                                    <div className="budget-stat-item">
                                        <span className="bstat-label">Spent</span>
                                        <span className="bstat-val" style={{ color: "#f87171" }}>
                                            {formatINR(budget.spent)}
                                        </span>
                                    </div>
                                    <div className="budget-stat-item">
                                        <span className="bstat-label">Remaining</span>
                                        <span className="bstat-val" style={{ color: "#10b981" }}>
                                            {formatINR(Math.max(0, budget.remaining))}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="budget-progress-section">
                                    <div className="budget-progress-label">
                                        <span>Spending progress</span>
                                        <span style={{ color: barColor, fontWeight: 600 }}>
                                            {usagePct}%
                                        </span>
                                    </div>
                                    <div className="budget-progress-track">
                                        <div
                                            className="budget-progress-fill"
                                            style={{ width: `${usagePct}%`, background: barColor }}
                                        />
                                    </div>
                                    {usagePct >= 80 && (
                                        <div className={`budget-alert-msg ${usagePct >= 100 ? "danger" : "warning"}`}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                                <line x1="12" y1="9" x2="12" y2="13"/>
                                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                                            </svg>
                                            {usagePct >= 100
                                                ? "You have exceeded your budget for this month!"
                                                : "You are nearing your budget limit. Slow down on spending."}
                                        </div>
                                    )}
                                </div>

                                {/* Breakdown donut-style bars */}
                                <div className="budget-breakdown">
                                    <div className="breakdown-row">
                                        <span className="breakdown-label">Spent</span>
                                        <div className="breakdown-track">
                                            <div
                                                className="breakdown-fill"
                                                style={{ width: `${usagePct}%`, background: barColor }}
                                            />
                                        </div>
                                        <span className="breakdown-val">{formatINR(budget.spent)}</span>
                                    </div>
                                    <div className="breakdown-row">
                                        <span className="breakdown-label">Remaining</span>
                                        <div className="breakdown-track">
                                            <div
                                                className="breakdown-fill"
                                                style={{
                                                    width: `${Math.max(0, 100 - usagePct)}%`,
                                                    background: "#10b981",
                                                }}
                                            />
                                        </div>
                                        <span className="breakdown-val">
                                            {formatINR(Math.max(0, budget.remaining))}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Budget;
