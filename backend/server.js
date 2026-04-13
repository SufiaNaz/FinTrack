require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// ── Route imports ──────────────────────────────────────────────────────────
const authRoutes         = require("./routes/authRoutes");
const transactionRoutes  = require("./routes/transactionRoutes");
const dashboardRoutes    = require("./routes/dashboardRoutes");
const budgetRoutes       = require("./routes/budgetRoutes");
const reportRoutes       = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const insightRoutes      = require("./routes/insightRoutes");
const adminRoutes      = require("./routes/adminRoutes");


const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Database ───────────────────────────────────────────────────────────────
connectDB();

// ── Routes ─────────────────────────────────────────────────────────────────
// Auth:          POST /api/v1/user/register
//                POST /api/v1/user/login
//                POST /api/v1/user/logout
//                POST /api/v1/user/forgot-password
//                GET  /api/v1/user/getUser
app.use("/api/v1/user", authRoutes);

// Transactions:  POST   /api/v1/user/transaction
//                GET    /api/v1/user/transaction
//                PUT    /api/v1/user/transaction/:id
//                DELETE /api/v1/user/transaction/:id
app.use("/api/v1/user/transaction", transactionRoutes);

// Dashboard:     GET /api/v1/user/dashboard
//                GET /api/v1/user/summary
app.use("/api/v1/user", dashboardRoutes);

// Budget:        POST /api/v1/user/budget
//                POST /api/v1/user/budget/status
app.use("/api/v1/user/budget", budgetRoutes);

// Reports:       GET  /api/v1/user/report/:period
//                POST /api/v1/user/report/export
app.use("/api/v1/user/report", reportRoutes);

// Notifications: GET  /api/v1/user/notifications
//                POST /api/v1/user/notify/email
app.use("/api/v1/user/notifications", notificationRoutes);
app.use("/api/v1/user/notify",        notificationRoutes);

// Insights:      POST /api/v1/user/insights
app.use("/api/v1/user/insights", insightRoutes);

// Admin:         POST   /api/v1/admin/login
//                GET    /api/v1/admin/dashboard
//                GET    /api/v1/admin/users
//                DELETE /api/v1/admin/user/:id
//                GET    /api/v1/admin/transactions
app.use("/api/v1/admin", adminRoutes);


// ── Health check ───────────────────────────────────────────────────────────
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date() });
});

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error", error: err.message });
});

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));