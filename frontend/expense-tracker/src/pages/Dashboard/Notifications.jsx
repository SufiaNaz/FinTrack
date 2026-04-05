import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import "./Notifications.css";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Email notification form
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState("");
    const [emailError, setEmailError] = useState("");

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/user/notifications");
            setNotifications(data);
        } catch {
            setError("Failed to load notifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, []);

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setEmailError("");
        setEmailSuccess("");

        if (!subject.trim()) return setEmailError("Subject is required");
        if (!message.trim()) return setEmailError("Message is required");

        setSending(true);
        try {
            await axiosInstance.post("/user/notify/email", { subject, message });
            setEmailSuccess("Notification sent successfully.");
            setSubject("");
            setMessage("");
            fetchNotifications();
        } catch (err) {
            setEmailError(err.response?.data?.message || "Failed to send notification");
        } finally {
            setSending(false);
        }
    };

    const getIcon = (type) => {
        if (type === "budget_alert") return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
        );
        if (type === "email") return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
            </svg>
        );
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
        );
    };

    const getIconClass = (type) => {
        if (type === "budget_alert") return "notif-icon warning";
        if (type === "email") return "notif-icon blue";
        return "notif-icon default";
    };

    const getTypeBadge = (type) => {
        if (type === "budget_alert") return <span className="notif-badge warning">Budget Alert</span>;
        if (type === "email") return <span className="notif-badge blue">Email</span>;
        return <span className="notif-badge default">In-App</span>;
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <DashboardLayout>
            {/* Topbar */}
            <div className="notif-topbar">
                <div>
                    <h1 className="notif-page-title">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="unread-badge">{unreadCount} new</span>
                        )}
                    </h1>
                    <p className="notif-page-sub">Budget alerts and in-app messages</p>
                </div>
                <button className="refresh-btn" onClick={fetchNotifications}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"/>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                    Refresh
                </button>
            </div>

            <div className="notif-content">
                <div className="notif-layout">
                    {/* Notification List */}
                    <div className="notif-list-section">
                        <div className="section-header">
                            <span className="section-title">All Notifications</span>
                            <span className="section-count">{notifications.length} total</span>
                        </div>

                        {loading ? (
                            <div className="notif-empty">Loading...</div>
                        ) : error ? (
                            <div className="notif-empty error">{error}</div>
                        ) : notifications.length === 0 ? (
                            <div className="notif-empty">
                                <div className="notif-empty-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                    </svg>
                                </div>
                                <p>No notifications yet.</p>
                                <p className="notif-empty-hint">
                                    Budget alerts will appear here automatically when you reach 80% of your limit.
                                </p>
                            </div>
                        ) : (
                            <div className="notif-list">
                                {notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        className={`notif-item ${!n.isRead ? "unread" : ""}`}
                                    >
                                        <div className={getIconClass(n.type)}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="notif-body">
                                            <div className="notif-top-row">
                                                {getTypeBadge(n.type)}
                                                {!n.isRead && (
                                                    <span className="unread-dot" />
                                                )}
                                            </div>
                                            <p className="notif-message">{n.message}</p>
                                            <span className="notif-time">
                                                {formatDate(n.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Send Email Notification */}
                    <div className="notif-email-section">
                        <div className="section-header">
                            <span className="section-title">Send Email Notification</span>
                        </div>
                        <div className="notif-card">
                            <p className="notif-card-sub">
                                Send yourself an email notification about any financial update.
                            </p>

                            {emailError && <div className="notif-error">{emailError}</div>}
                            {emailSuccess && <div className="notif-success">{emailSuccess}</div>}

                            <form onSubmit={handleSendEmail} className="email-form">
                                <div className="efield-group">
                                    <label>Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Monthly budget summary"
                                        required
                                    />
                                </div>
                                <div className="efield-group">
                                    <label>Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Write your notification message..."
                                        rows={4}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="send-email-btn"
                                    disabled={sending}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"/>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                    </svg>
                                    {sending ? "Sending..." : "Send Notification"}
                                </button>
                            </form>

                         
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
