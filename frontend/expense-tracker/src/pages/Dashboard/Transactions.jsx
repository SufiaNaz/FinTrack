import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import "./Transactions.css";

const INCOME_CATEGORIES = [
    "Salary", "Freelance", "Business", "Investment",
    "Rental", "Gift", "Bonus", "Other",
];

const EXPENSE_CATEGORIES = [
    "Food", "Transport", "Shopping", "Bills",
    "Health", "Education", "Entertainment", "Rent",
    "Clothing", "Travel", "Subscriptions", "Other",
];

const formatINR = (val) =>
    "Rs. " + Number(val).toLocaleString("en-IN");

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [txChartYear, setTxChartYear] = useState("all");
    const [chartSummary, setChartSummary] = useState([]);
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("expense"); // "income" | "expense"
    const [form, setForm] = useState({
        category: "",
        amount: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        icon: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // Filters
    const [filterType, setFilterType] = useState("all");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterFrom, setFilterFrom] = useState("");
    const [filterTo, setFilterTo] = useState("");

    // Delete confirmation
    const [deleteId, setDeleteId] = useState(null);

    const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const availableYears = useMemo(() => {
    return [...new Set(chartSummary.map((s) => s.month.slice(0, 4)))].sort();
}, [chartSummary]);

const txChartData = useMemo(() => {
    let data = [...chartSummary].sort((a, b) => a.month.localeCompare(b.month));
    if (txChartYear !== "all") {
        data = data.filter((s) => s.month.startsWith(txChartYear));
    }
    return data.map((s) => {
        const year = parseInt(s.month.slice(0, 4));
        const monthIndex = parseInt(s.month.slice(5, 7)) - 1;
        return {
            month: txChartYear === "all"
                ? `${MONTH_NAMES[monthIndex]} '${String(year).slice(2)}`
                : MONTH_NAMES[monthIndex],
            income: s.income || 0,
            expenses: s.expense || 0,
        };
    });
}, [chartSummary, txChartYear]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filterType !== "all") params.type = filterType;
            if (filterCategory) params.category = filterCategory;
            if (filterFrom) params.from = filterFrom;
            if (filterTo) params.to = filterTo;
    
            const [txRes, sumRes] = await Promise.all([
                axiosInstance.get("/user/transaction", { params }),
                axiosInstance.get("/user/summary"),
            ]);
            setTransactions(txRes.data);
            setChartSummary(sumRes.data);
        } catch {
            setError("Failed to load transactions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTransactions(); }, [filterType, filterCategory, filterFrom, filterTo]);

    const openModal = (type) => {
        setModalType(type);
        setForm({
            category: "",
            amount: "",
            description: "",
            date: new Date().toISOString().slice(0, 10),
            icon: "",
        });
        setFormError("");
        setShowModal(true);
    };

    const handleFormChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!form.category) return setFormError("Please select a category");
        if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
            return setFormError("Enter a valid amount");
        if (!form.date) return setFormError("Please select a date");

        setSubmitting(true);
        try {
            await axiosInstance.post("/user/transaction", {
                type: modalType,
                category: form.category,
                amount: Number(form.amount),
                description: form.description,
                date: form.date,
            });
            setShowModal(false);
            fetchTransactions();
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to add transaction");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/user/transaction/${id}`);
            setDeleteId(null);
            fetchTransactions();
        } catch {
            alert("Failed to delete transaction");
        }
    };

    const clearFilters = () => {
        setFilterType("all");
        setFilterCategory("");
        setFilterFrom("");
        setFilterTo("");
    };

    const categories = modalType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
    const uniqueCategories = [...new Set(allCategories)].sort();

    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);

    return (
        <DashboardLayout>
            {/* Topbar */}
            <div className="tx-topbar">
                <div>
                    <h1 className="tx-title">Transactions</h1>
                    <p className="tx-sub">Manage your income and expenses</p>
                </div>
                <div className="tx-topbar-actions">
                    <button className="btn-income" onClick={() => openModal("income")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Income
                    </button>
                    <button className="btn-expense" onClick={() => openModal("expense")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Expense
                    </button>
                </div>
            </div>

            <div className="tx-content">
                {/* Summary Strip */}
                <div className="tx-summary">
                    <div className="summary-item">
                        <span className="summary-label">Showing income</span>
                        <span className="summary-val green">{formatINR(totalIncome)}</span>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-item">
                        <span className="summary-label">Showing expenses</span>
                        <span className="summary-val red">{formatINR(totalExpense)}</span>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-item">
                        <span className="summary-label">Net</span>
                        <span className={`summary-val ${totalIncome - totalExpense >= 0 ? "green" : "red"}`}>
                            {formatINR(totalIncome - totalExpense)}
                        </span>
                    </div>
                    <div className="summary-item" style={{ marginLeft: "auto" }}>
                        <span className="summary-label">Total records</span>
                        <span className="summary-val">{transactions.length}</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="tx-filters">
                    <div className="filter-group">
                        <label>Type</label>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                            <option value="all">All</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Category</label>
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                            <option value="">All categories</option>
                            {uniqueCategories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>From</label>
                        <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
                    </div>
                    <div className="filter-group">
                        <label>To</label>
                        <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
                    </div>
                    <button className="clear-btn" onClick={clearFilters}>Clear</button>
                </div>

                
                {/* Transaction List */}
                {loading ? (
                    <div className="tx-empty">Loading...</div>
                ) : error ? (
                    <div className="tx-empty error">{error}</div>
                ) : transactions.length === 0 ? (
                    <div className="tx-empty">
                        No transactions found.
                        <button className="inline-link" onClick={() => openModal("expense")}>
                            Add your first one
                        </button>
                    </div>
                ) : (
                    <div className="tx-list-card">
                        <div className="tx-list-header">
                            <span>Transaction</span>
                            <span>Category</span>
                            <span>Date</span>
                            <span>Amount</span>
                            <span></span>
                        </div>
                        {transactions.map((tx) => (
                            <div key={tx._id} className="tx-list-row">
                                <div className="tx-name-cell">
                                    <div className={`tx-type-badge ${tx.type}`}>
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
                                    <span className="tx-desc">
                                        {tx.description || tx.category}
                                    </span>
                                </div>
                                <span className="tx-cat-pill">{tx.category}</span>
                                <span className="tx-date">
                                    {new Date(tx.date).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "short", year: "numeric",
                                    })}
                                </span>
                                <span className={`tx-amount ${tx.type === "income" ? "green" : "red"}`}>
                                    {tx.type === "income" ? "+" : "-"}{formatINR(tx.amount)}
                                </span>
                                <button
                                    className="delete-btn"
                                    onClick={() => setDeleteId(tx._id)}
                                    title="Delete"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                        <path d="M10 11v6M14 11v6"/>
                                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Transaction Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className={`modal-title ${modalType}`}>
                                Add {modalType === "income" ? "Income" : "Expense"}
                            </h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>

                        {formError && <div className="form-error">{formError}</div>}

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Category *</label>
                                <select name="category" value={form.category} onChange={handleFormChange} required>
                                    <option value="">Select category</option>
                                    {categories.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Amount (Rs.) *</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleFormChange}
                                    placeholder="0"
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    placeholder="Optional note"
                                />
                            </div>

                            <div className="form-group">
                                <label>Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`modal-submit ${modalType}`}
                                disabled={submitting}
                            >
                                {submitting ? "Adding..." : `Add ${modalType === "income" ? "Income" : "Expense"}`}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Delete transaction?</h2>
                        <p className="confirm-text">This cannot be undone.</p>
                        <div className="confirm-actions">
                            <button className="cancel-btn" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="confirm-delete-btn" onClick={() => handleDelete(deleteId)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Monthly Chart */}
{chartSummary.length > 0 && (
    <div className="txp-chart-card">
        <div className="txp-chart-header">
            <div className="txp-chart-title-group">
                <span className="txp-chart-title">Monthly Overview</span>
                <span className="txp-chart-sub">
                    {txChartYear === "all" ? "All time" : txChartYear}
                </span>
            </div>
            <div className="txp-year-pills">
                <button
                    className={`txp-pill ${txChartYear === "all" ? "active" : ""}`}
                    onClick={() => setTxChartYear("all")}
                >
                    All
                </button>
                {availableYears.map((y) => (
                    <button
                        key={y}
                        className={`txp-pill ${txChartYear === y ? "active" : ""}`}
                        onClick={() => setTxChartYear(y)}
                    >
                        {y}
                    </button>
                ))}
            </div>
        </div>

        {txChartData.length === 0 ? (
            <div className="txp-empty">No data for {txChartYear}.</div>
        ) : (
            <>
                <svg
                    viewBox="0 0 600 160"
                    preserveAspectRatio="none"
                    style={{ width: "100%", height: "160px", display: "block" }}
                >
                    {(() => {
                        const maxVal = Math.max(...txChartData.flatMap(d => [d.income, d.expenses]), 1);
                        const padL = 48, padR = 12, padT = 10, padB = 28;
                        const W = 600, H = 160;
                        const chartW = W - padL - padR;
                        const chartH = H - padT - padB;
                        const cols = txChartData.length;
                        const colW = chartW / cols;
                        const barW = Math.min(colW * 0.28, 18);
                        const yTicks = [0, 0.25, 0.5, 0.75, 1];

                        return (
                            <g>
                                {/* Grid lines + Y labels */}
                                {yTicks.map((t, i) => {
                                    const y = padT + chartH * (1 - t);
                                    const val = Math.round(maxVal * t);
                                    const label = val >= 1000 ? Math.round(val / 1000) + "k" : val;
                                    return (
                                        <g key={i}>
                                            <line x1={padL} x2={W - padR} y1={y} y2={y}
                                                stroke="#1e1e1e" strokeWidth="1" />
                                            <text x={padL - 6} y={y + 4}
                                                textAnchor="end" fontSize="9" fill="#4b5563"
                                                fontFamily="Poppins, sans-serif">
                                                {label}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Bars */}
                                {txChartData.map((d, i) => {
                                    const cx = padL + colW * i + colW / 2;
                                    const iH = (d.income / maxVal) * chartH;
                                    const eH = (d.expenses / maxVal) * chartH;
                                    return (
                                        <g key={i}>
                                            <rect
                                                x={cx - barW - 1}
                                                y={padT + chartH - iH}
                                                width={barW} height={Math.max(iH, 0)}
                                                fill="#10b981" rx="2"
                                            />
                                            <rect
                                                x={cx + 1}
                                                y={padT + chartH - eH}
                                                width={barW} height={Math.max(eH, 0)}
                                                fill="#f87171" rx="2"
                                            />
                                            <text x={cx} y={H - padB + 14}
                                                textAnchor="middle" fontSize="8" fill="#4b5563"
                                                fontFamily="Poppins, sans-serif">
                                                {d.month}
                                            </text>
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    })()}
                </svg>

                <div className="txp-legend">
                    <span className="txp-legend-item">
                        <span className="txp-legend-dot green" />
                        Income
                    </span>
                    <span className="txp-legend-item">
                        <span className="txp-legend-dot red" />
                        Expenses
                    </span>
                </div>
            </>
        )}
    </div>
)}

        </DashboardLayout>
    );
};

export default Transactions;
