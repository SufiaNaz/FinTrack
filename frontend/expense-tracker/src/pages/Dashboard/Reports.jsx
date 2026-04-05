import { useState } from "react";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Cell,
} from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import "./Reports.css";

const CATEGORY_COLORS = [
    "#10b981", "#fbbf24", "#f87171", "#60a5fa",
    "#a78bfa", "#fb923c", "#34d399", "#e879f9",
];

const formatINR = (val) =>
    "Rs. " + Number(val).toLocaleString("en-IN");

const formatK = (val) =>
    val >= 1000 ? "Rs." + Math.round(val / 1000) + "k" : "Rs." + val;

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);
const getCurrentYear = () => String(new Date().getFullYear());

const Reports = () => {
    const [periodType, setPeriodType] = useState("monthly"); // "monthly" | "yearly"
    const [month, setMonth] = useState(getCurrentMonth());
    const [year, setYear] = useState(getCurrentYear());

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState("");

    const period = periodType === "monthly" ? month : year;

    const fetchReport = async () => {
        if (!period) return;
        setLoading(true);
        setError("");
        setReport(null);
        try {
            const { data } = await axiosInstance.get(`/user/report/${period}`);
            setReport(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load report.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (format) => {
        setExportError("");
        setExporting(true);
        try {
            const token = localStorage.getItem("token");
            const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

            const response = await fetch(`${baseURL}/user/report/export`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ period, format }),
            });

            if (!response.ok) {
                const err = await response.json();
                setExportError(err.message || "Export failed");
                return;
            }

            // Trigger file download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `FinTrack_${period}.${format === "excel" ? "xlsx" : "pdf"}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setExportError("Export failed. Check your backend is running.");
        } finally {
            setExporting(false);
        }
    };

    // Prepare chart data from categoryBreakdown
    const categoryChartData = report
        ? Object.entries(report.categoryBreakdown).map(([name, value]) => ({
            name,
            Amount: value,
        })).sort((a, b) => b.Amount - a.Amount)
        : [];

    const periodLabel = periodType === "monthly"
        ? new Date(month + "-01").toLocaleString("en-IN", { month: "long", year: "numeric" })
        : year;

    return (
        <DashboardLayout>
            {/* Topbar */}
            <div className="rep-topbar">
                <div>
                    <h1 className="rep-title">Reports</h1>
                    <p className="rep-sub">Monthly and yearly financial summaries</p>
                </div>
            </div>

            <div className="rep-content">
                {/* Controls */}
                <div className="rep-controls">
                    <div className="period-type-tabs">
                        <button
                            className={`period-tab ${periodType === "monthly" ? "active" : ""}`}
                            onClick={() => setPeriodType("monthly")}
                        >
                            Monthly
                        </button>
                        <button
                            className={`period-tab ${periodType === "yearly" ? "active" : ""}`}
                            onClick={() => setPeriodType("yearly")}
                        >
                            Yearly
                        </button>
                    </div>

                    {periodType === "monthly" ? (
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="rep-period-input"
                        />
                    ) : (
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="rep-period-input"
                        >
                            {[2023, 2024, 2025, 2026].map((y) => (
                                <option key={y} value={String(y)}>{y}</option>
                            ))}
                        </select>
                    )}

                    <button
                        className="generate-btn"
                        onClick={fetchReport}
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate Report"}
                    </button>
                </div>

                {/* Error */}
                {error && <div className="rep-error">{error}</div>}

                {/* Empty state */}
                {!report && !loading && !error && (
                    <div className="rep-empty">
                        <div className="rep-empty-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="18" y="14" width="4" height="6"/>
                                <rect x="11" y="10" width="4" height="10"/>
                                <rect x="4" y="4" width="4" height="16"/>
                            </svg>
                        </div>
                        <p>Select a period and click Generate Report</p>
                    </div>
                )}

                {/* Report Content */}
                {report && (
                    <>
                        {/* Summary Cards */}
                        <div className="rep-summary-grid">
                            <div className="rep-stat-card">
                                <div className="rep-stat-icon green">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                                    </svg>
                                </div>
                                <div className="rep-stat-label">Total Income</div>
                                <div className="rep-stat-value green">{formatINR(report.totalIncome)}</div>
                            </div>
                            <div className="rep-stat-card">
                                <div className="rep-stat-icon red">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                                    </svg>
                                </div>
                                <div className="rep-stat-label">Total Expenses</div>
                                <div className="rep-stat-value red">{formatINR(report.totalExpense)}</div>
                            </div>
                            <div className="rep-stat-card">
                                <div className="rep-stat-icon blue">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                    </svg>
                                </div>
                                <div className="rep-stat-label">Net Savings</div>
                                <div className={`rep-stat-value ${report.netSavings >= 0 ? "blue" : "red"}`}>
                                    {formatINR(report.netSavings)}
                                </div>
                            </div>
                            <div className="rep-stat-card">
                                <div className="rep-stat-icon amber">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="8" y1="6" x2="21" y2="6"/>
                                        <line x1="8" y1="12" x2="21" y2="12"/>
                                        <line x1="8" y1="18" x2="21" y2="18"/>
                                        <line x1="3" y1="6" x2="3.01" y2="6"/>
                                        <line x1="3" y1="12" x2="3.01" y2="12"/>
                                        <line x1="3" y1="18" x2="3.01" y2="18"/>
                                    </svg>
                                </div>
                                <div className="rep-stat-label">Transactions</div>
                                <div className="rep-stat-value amber">{report.transactions.length}</div>
                            </div>
                        </div>

                        <div className="rep-body">
                            {/* Category Breakdown Chart */}
                            <div className="rep-card">
                                <div className="rep-card-header">
                                    <span className="rep-card-title">Expense Breakdown — {periodLabel}</span>
                                </div>
                                {categoryChartData.length === 0 ? (
                                    <div className="rep-chart-empty">No expense data for this period.</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={categoryChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis tickFormatter={formatK} tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }}
                                                labelStyle={{ color: "#e5e7eb", fontSize: 12 }}
                                                itemStyle={{ color: "#9ca3af", fontSize: 12 }}
                                                formatter={(val) => formatINR(val)}
                                            />
                                            <Bar dataKey="Amount" radius={[4, 4, 0, 0]}>
                                                {categoryChartData.map((_, i) => (
                                                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>

                            {/* Transaction List */}
                            <div className="rep-card">
                                <div className="rep-card-header">
                                    <span className="rep-card-title">All Transactions</span>
                                    <span className="rep-card-count">{report.transactions.length} records</span>
                                </div>

                                {/* Export buttons */}
                                <div className="export-row">
                                    <button
                                        className="export-btn excel"
                                        onClick={() => handleExport("excel")}
                                        disabled={exporting}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                            <polyline points="14 2 14 8 20 8"/>
                                            <line x1="16" y1="13" x2="8" y2="13"/>
                                            <line x1="16" y1="17" x2="8" y2="17"/>
                                        </svg>
                                        Export Excel
                                    </button>
                                    <button
                                        className="export-btn pdf"
                                        onClick={() => handleExport("pdf")}
                                        disabled={exporting}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                            <polyline points="14 2 14 8 20 8"/>
                                        </svg>
                                        Export PDF
                                    </button>
                                </div>

                                {exportError && (
                                    <div className="export-error">{exportError}</div>
                                )}

                                {report.transactions.length === 0 ? (
                                    <div className="rep-chart-empty">No transactions for this period.</div>
                                ) : (
                                    <div className="rep-tx-list">
                                        <div className="rep-tx-header">
                                            <span>Description</span>
                                            <span>Category</span>
                                            <span>Date</span>
                                            <span>Amount</span>
                                        </div>
                                        {report.transactions.map((tx) => (
                                            <div key={tx._id} className="rep-tx-row">
                                                <span className="rep-tx-desc">
                                                    <span className={`rep-tx-dot ${tx.type}`} />
                                                    {tx.description || tx.category}
                                                </span>
                                                <span className="rep-tx-cat">{tx.category}</span>
                                                <span className="rep-tx-date">
                                                    {new Date(tx.date).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "short",
                                                    })}
                                                </span>
                                                <span className={`rep-tx-amount ${tx.type}`}>
                                                    {tx.type === "income" ? "+" : "-"}{formatINR(tx.amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Reports;
