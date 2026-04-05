import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
    BarChart, Bar,
} from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import "./Home.css";

const COLORS = {
    income: "#10b981",
    expense: "#f87171",
    savings: "#60a5fa",
    warning: "#fbbf24",
};

const CATEGORY_COLORS = [
    "#10b981", "#fbbf24", "#f87171", "#60a5fa",
    "#a78bfa", "#fb923c", "#34d399", "#e879f9",
];

const formatINR = (val) =>
    "Rs." + Number(val).toLocaleString("en-IN");

const formatK = (val) =>
    val >= 1000 ? "Rs." + Math.round(val / 1000) + "k" : "Rs." + val;

const Home = () => {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, sumRes] = await Promise.all([
                    axiosInstance.get("/user/dashboard"),
                    axiosInstance.get("/user/summary"),
                ]);
                setDashboard(dashRes.data);
                setSummary(sumRes.data);
            } catch (err) {
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <DashboardLayout>
            <div className="dash-loading">Loading dashboard...</div>
        </DashboardLayout>
    );

    if (error) return (
        <DashboardLayout>
            <div className="dash-error">{error}</div>
        </DashboardLayout>
    );

    const {
        totalIncome = 0,
        totalExpense = 0,
        netBalance = 0,
        currentMonth = {},
        recentTransactions = [],
        categoryBreakdown = [],
        budget = null,
    } = dashboard || {};

    const savingsRate = totalIncome > 0
        ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1)
        : 0;

    // Format summary for line chart
    const lineData = summary.map((s) => ({
      month: s.month.slice(5, 7) === "01" ? "Jan"
           : s.month.slice(5, 7) === "02" ? "Feb"
           : s.month.slice(5, 7) === "03" ? "Mar"
           : s.month.slice(5, 7) === "04" ? "Apr"
           : s.month.slice(5, 7) === "05" ? "May"
           : s.month.slice(5, 7) === "06" ? "Jun"
           : s.month.slice(5, 7) === "07" ? "Jul"
           : s.month.slice(5, 7) === "08" ? "Aug"
           : s.month.slice(5, 7) === "09" ? "Sep"
           : s.month.slice(5, 7) === "10" ? "Oct"
           : s.month.slice(5, 7) === "11" ? "Nov"
           : "Dec",
      Income: s.income || 0,
      Expenses: s.expense || 0,
  }));

    // Format categoryBreakdown for pie chart
    const pieData = categoryBreakdown.map((c) => ({
        name: c._id,
        value: c.total,
    }));

    // Format for budget bar chart
    const budgetBarData = categoryBreakdown.slice(0, 5).map((c, i) => ({
        name: c._id,
        Spent: c.total,
    }));

    const now = new Date();
    const monthLabel = now.toLocaleString("en-IN", { month: "long", year: "numeric" });

    return (
        <DashboardLayout>
            {/* Topbar */}
            <div className="dash-topbar">
                <div>
                    <h1 className="dash-title">Dashboard</h1>
                    <p className="dash-sub">{monthLabel}</p>
                </div>
                <div className="topbar-actions">
                    <button
                        className="notif-btn"
                        onClick={() => navigate("/notifications")}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="dash-content">
                {/* Stat Cards */}
                <div className="stat-grid">
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                                <polyline points="16 7 22 7 22 13"/>
                            </svg>
                        </div>
                        <div className="stat-label">Total Income</div>
                        <div className="stat-value green">{formatINR(totalIncome)}</div>
                        <div className="stat-change green">
                            This month: {formatINR(currentMonth.income || 0)}
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon red">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                                <polyline points="17 18 23 18 23 12"/>
                            </svg>
                        </div>
                        <div className="stat-label">Total Expenses</div>
                        <div className="stat-value red">{formatINR(totalExpense)}</div>
                        <div className="stat-change red">
                            This month: {formatINR(currentMonth.expense || 0)}
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                        </div>
                        <div className="stat-label">Net Balance</div>
                        <div className="stat-value blue">{formatINR(netBalance)}</div>
                        <div className="stat-change blue">{savingsRate}% savings rate</div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="charts-row">
                    {/* Line Chart */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Income vs Expenses</span>
                            <span className="card-sub">Last 6 months</span>
                        </div>
                        {lineData.length === 0 ? (
                            <div className="chart-empty">No data yet. Add transactions to see trends.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tickFormatter={formatK} tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }}
                                        labelStyle={{ color: "#e5e7eb", fontSize: 12 }}
                                        itemStyle={{ color: "#9ca3af", fontSize: 12 }}
                                        formatter={(val) => formatINR(val)}
                                    />
                                    <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
                                    <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                    <Line type="monotone" dataKey="Expenses" stroke="#f87171" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Pie Chart */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Spending Breakdown</span>
                            <span className="card-sub">By category</span>
                        </div>
                        {pieData.length === 0 ? (
                            <div className="chart-empty">No expense data yet.</div>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={70}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {pieData.map((_, i) => (
                                                <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }}
                                            itemStyle={{ color: "#9ca3af", fontSize: 12 }}
                                            formatter={(val) => formatINR(val)}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="pie-legend">
                                    {pieData.slice(0, 5).map((item, i) => (
                                        <div key={i} className="legend-item">
                                            <span className="legend-dot" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                                            <span className="legend-label">{item.name}</span>
                                            <span className="legend-val">{formatINR(item.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="bottom-row">
                    {/* Recent Transactions */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Recent Transactions</span>
                            <button className="card-link" onClick={() => navigate("/transactions")}>
                                View all
                            </button>
                        </div>
                        {recentTransactions.length === 0 ? (
                            <div className="chart-empty">No transactions yet.</div>
                        ) : (
                            <div className="tx-list">
                                {recentTransactions.map((tx) => (
                                    <div key={tx._id} className="tx-row">
                                        <div className={`tx-icon ${tx.type === "income" ? "green" : "red"}`}>
                                            {tx.type === "income" ? (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                                                </svg>
                                            )}
                                        </div>
                                        <div className="tx-info">
                                            <div className="tx-name">{tx.description || tx.category}</div>
                                            <div className="tx-cat">
                                                {tx.category} · {new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                            </div>
                                        </div>
                                        <div className={`tx-amount ${tx.type === "income" ? "green" : "red"}`}>
                                            {tx.type === "income" ? "+" : "-"}{formatINR(tx.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Budget Progress */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Budget Progress</span>
                            <button className="card-link" onClick={() => navigate("/budget")}>
                                {budget ? "Edit" : "Set budget"}
                            </button>
                        </div>
                        {!budget ? (
                            <div className="chart-empty">
                                No budget set for this month.{" "}
                                <button className="inline-link" onClick={() => navigate("/budget")}>
                                    Set one now
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="budget-summary">
                                    <div className="budget-stat">
                                        <span className="budget-stat-label">Limit</span>
                                        <span className="budget-stat-val">{formatINR(budget.limit)}</span>
                                    </div>
                                    <div className="budget-stat">
                                        <span className="budget-stat-label">Spent</span>
                                        <span className="budget-stat-val red">{formatINR(budget.spent)}</span>
                                    </div>
                                    <div className="budget-stat">
                                        <span className="budget-stat-label">Remaining</span>
                                        <span className="budget-stat-val green">{formatINR(Math.max(0, budget.remaining))}</span>
                                    </div>
                                </div>
                                <div className="budget-bar-track">
                                    <div
                                        className="budget-bar-fill"
                                        style={{
                                            width: `${Math.min(budget.usagePercent, 100)}%`,
                                            background: budget.usagePercent >= 100 ? "#f87171"
                                                : budget.usagePercent >= 80 ? "#fbbf24"
                                                : "#10b981",
                                        }}
                                    />
                                </div>
                                <div className="budget-pct-label">
                                    {budget.usagePercent}% used
                                    {budget.usagePercent >= 80 && (
                                        <span className="budget-warn">
                                            {budget.usagePercent >= 100 ? " · Over budget!" : " · Nearing limit"}
                                        </span>
                                    )}
                                </div>

                                {/* Category bar chart */}
                                {budgetBarData.length > 0 && (
                                    <ResponsiveContainer width="100%" height={130}>
                                        <BarChart data={budgetBarData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <YAxis tickFormatter={formatK} tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }}
                                                itemStyle={{ fontSize: 11, color: "#9ca3af" }}
                                                formatter={(val) => formatINR(val)}
                                            />
                                            <Bar dataKey="Spent" radius={[4, 4, 0, 0]}>
                                                {budgetBarData.map((_, i) => (
                                                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Home;
