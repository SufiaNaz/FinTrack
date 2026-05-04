import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("overview");
    const [overview, setOverview] = useState(null);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [userSearch, setUserSearch] = useState("");
    const [txnSearch, setTxnSearch] = useState("");
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [toast, setToast] = useState("");

    useEffect(() => { loadOverview(); loadUsers(); loadTransactions(); }, []);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const fmt = (n) => {
        if (n >= 1e6) return "₹" + (n / 1e6).toFixed(1) + "M";
        if (n >= 1e3) return "₹" + (n / 1e3).toFixed(1) + "K";
        return "₹" + Math.round(n);
    };

    const fmtDate = (d) =>
        new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    const loadOverview = async () => {
        try {
            const { data } = await axiosInstance.get("/admin/dashboard");
            setOverview(data);
        } catch (e) {
            console.error("Failed to load overview", e);
        }
    };

    const loadUsers = async () => {
        try {
            const { data } = await axiosInstance.get("/admin/users");
            setUsers(data);
        } catch (e) {
            console.error("Failed to load users", e);
        }
    };

    const loadTransactions = async () => {
        try {
            const { data } = await axiosInstance.get("/admin/transactions");
            setTransactions(data);
        } catch (e) {
            console.error("Failed to load transactions", e);
        }
    };

    const handleDelete = async () => {
        if (!pendingDeleteId) return;
        try {
            await axiosInstance.delete(`/admin/user/${pendingDeleteId}`);
            setUsers((prev) => prev.filter((u) => u._id !== pendingDeleteId));
            setPendingDeleteId(null);
            showToast("User deleted successfully");
            loadOverview();
        } catch (e) {
            showToast("Failed to delete user");
            setPendingDeleteId(null);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const filteredUsers = users.filter(
        (u) =>
            (u.fullName || "").toLowerCase().includes(userSearch.toLowerCase()) ||
            (u.email || "").toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredTxns = transactions.filter(
        (t) =>
            (t.title || "").toLowerCase().includes(txnSearch.toLowerCase()) ||
            (t.category || "").toLowerCase().includes(txnSearch.toLowerCase()) ||
            (t.userId?.fullName || "").toLowerCase().includes(txnSearch.toLowerCase())
    );

    return (
        <div className="admin-shell">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-logo">
                    <svg viewBox="0 0 64 64" width="28" height="28">
                        <circle cx="32" cy="32" r="30" fill="rgba(87,92,181,0.2)" />
                        <path d="M16 38 L28 24 L36 34 L48 18" fill="none" stroke="#6f74d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>FinTrack</span>
                    <span className="admin-tag">Admin</span>
                </div>

                <nav className="admin-nav">
                    {[
                        { id: "overview", label: "Overview", icon: <OverviewIcon /> },
                        { id: "users", label: "Users", icon: <UsersIcon /> },
                        { id: "transactions", label: "Transactions", icon: <TxnIcon /> },
                    ].map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${activePage === item.id ? "active" : ""}`}
                            onClick={() => setActivePage(item.id)}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="avatar">{user?.fullName?.[0]?.toUpperCase() || "A"}</div>
                    <div className="admin-info">
                        <div className="admin-name">{user?.fullName || "Admin"}</div>
                        <div className="admin-role">Super Admin</div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Logout">
                        <LogoutIcon />
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="admin-main">

                {/* Overview */}
                {activePage === "overview" && (
                    <div className="admin-page">
                        <h1 className="page-title">Overview</h1>
                        <p className="page-sub">Live platform statistics</p>

                        <div className="stats-grid">
                            <StatCard label="Total Users" value={overview?.totalUsers ?? "—"} hint="Registered accounts" />
                            <StatCard label="Transactions" value={overview?.totalTransactions ?? "—"} hint="All time" />
                            <StatCard label="Platform Income" value={fmt(overview?.platformTotalIncome || 0)} hint="Total logged" hintColor="green" />
                            <StatCard label="Platform Expense" value={fmt(overview?.platformTotalExpense || 0)} hint="Total logged" hintColor="red" />
                        </div>

                        <div className="two-col">
                            <div className="card">
                                <div className="card-header">
                                    <span className="card-title">Recent Users</span>
                                    <span className="card-count">{overview?.recentUsers?.length || 0} recent</span>
                                </div>
                                <table className="mini-table">
                                    <tbody>
                                        {overview?.recentUsers?.length ? overview.recentUsers.map((u) => (
                                            <tr key={u._id}>
                                                <td>{u.fullName || "—"}</td>
                                                <td>{u.email || "—"}</td>
                                            </tr>
                                        )) : <tr><td colSpan="2" className="no-data">No users yet</td></tr>}
                                    </tbody>
                                </table>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <span className="card-title">Recent Transactions</span>
                                    <span className="card-count">{overview?.recentTransactions?.length || 0} recent</span>
                                </div>
                                <table className="mini-table">
                                    <tbody>
                                        {overview?.recentTransactions?.length ? overview.recentTransactions.map((t) => (
                                            <tr key={t._id}>
                                                <td>{t.title || t.category || "—"}</td>
                                                <td><span className={`pill ${t.type}`}>{t.type}</span></td>
                                                <td>{fmt(t.amount || 0)}</td>
                                            </tr>
                                        )) : <tr><td colSpan="3" className="no-data">No transactions yet</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users */}
                {activePage === "users" && (
                    <div className="admin-page">
                        <h1 className="page-title">Users</h1>
                        <p className="page-sub">Manage all registered users</p>
                        <input
                            className="search-input"
                            placeholder="Search by name or email..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                        />
                        <div className="full-card">
                            <table className="full-table">
                                <thead>
                                    <tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length ? filteredUsers.map((u) => (
                                        <tr key={u._id}>
                                            <td>{u.fullName || "—"}</td>
                                            <td>{u.email || "—"}</td>
                                            <td>{u.phone || "—"}</td>
                                            <td>{fmtDate(u.createdAt)}</td>
                                            <td>
                                                <button className="del-btn" onClick={() => setPendingDeleteId(u._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )) : <tr><td colSpan="5" className="no-data">No users found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Transactions */}
                {activePage === "transactions" && (
                    <div className="admin-page">
                        <h1 className="page-title">Transactions</h1>
                        <p className="page-sub">All platform transactions</p>
                        <input
                            className="search-input"
                            placeholder="Search by title, category or user..."
                            value={txnSearch}
                            onChange={(e) => setTxnSearch(e.target.value)}
                        />
                        <div className="full-card">
                            <table className="full-table">
                                <thead>
                                    <tr><th>Title</th><th>User</th><th>Category</th><th>Amount</th><th>Type</th><th>Date</th></tr>
                                </thead>
                                <tbody>
                                    {filteredTxns.length ? filteredTxns.map((t) => (
                                        <tr key={t._id}>
                                            <td>{t.title || t.category || "—"}</td>
                                            <td>{t.userId?.fullName || "—"}</td>
                                            <td>{t.category || "—"}</td>
                                            <td>{fmt(t.amount || 0)}</td>
                                            <td><span className={`pill ${t.type}`}>{t.type}</span></td>
                                            <td>{fmtDate(t.createdAt || t.date)}</td>
                                        </tr>
                                    )) : <tr><td colSpan="6" className="no-data">No transactions found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Delete Confirm Modal */}
            {pendingDeleteId && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <h3>Delete User</h3>
                        <p>This will permanently delete the user and all their data. This cannot be undone.</p>
                        <div className="confirm-actions">
                            <button className="btn-cancel" onClick={() => setPendingDeleteId(null)}>Cancel</button>
                            <button className="btn-confirm" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && <div className="admin-toast">{toast}</div>}
        </div>
    );
};

const StatCard = ({ label, value, hint, hintColor }) => (
    <div className="stat-card">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className={`stat-hint ${hintColor || ""}`}>{hint}</div>
    </div>
);

const OverviewIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
);
const UsersIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);
const TxnIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
);
const LogoutIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

export default AdminDashboard;