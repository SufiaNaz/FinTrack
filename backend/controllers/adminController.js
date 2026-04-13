const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Notification = require("../models/Notification");
const jwt = require("jsonwebtoken");

// ── POST /admin/login ──────────────────────────────────────────────────────

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email, role: "admin" });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }


             console.log("USER FOUND:", user);

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const { password: _, resetPasswordToken, resetPasswordExpires, ...safeUser } = user._doc;
             res.status(200).json({ id: user._id, user: safeUser, token });

        res.status(200).json({ id: user._id, user, token });
    } catch (err) {

        console.log("ADMIN LOGIN ERROR:", err);
        res.status(500).json({ message: "Error during admin login", error: err.message });
    }
};

// ── GET /admin/dashboard ───────────────────────────────────────────────────

exports.getAdminDashboard = async (req, res) => {
    try {
        const [totalUsers, totalTransactions, recentUsers, recentTransactions] =
            await Promise.all([
                User.countDocuments({ role: "user" }),
                Transaction.countDocuments(),
                User.find({ role: "user" })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .select("-password"),
                Transaction.find().sort({ createdAt: -1 }).limit(5),
            ]);

        const [incomeAgg, expenseAgg] = await Promise.all([
            Transaction.aggregate([
                { $match: { type: "income" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
            Transaction.aggregate([
                { $match: { type: "expense" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
        ]);

        res.status(200).json({
            totalUsers,
            totalTransactions,
            platformTotalIncome: incomeAgg[0]?.total || 0,
            platformTotalExpense: expenseAgg[0]?.total || 0,
            recentUsers,
            recentTransactions,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching admin dashboard", error: err.message });
    }
};

// ── GET /admin/users ───────────────────────────────────────────────────────

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

// ── DELETE /admin/user/:id ─────────────────────────────────────────────────

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role === "admin") {
            return res.status(403).json({ message: "Cannot delete an admin account" });
        }

        // Cascade delete user data
        await Promise.all([
            User.findByIdAndDelete(id),
            Transaction.deleteMany({ userId: id }),
            Budget.deleteMany({ userId: id }),
            Notification.deleteMany({ userId: id }),
        ]);

        res.status(200).json({ message: "User and all associated data deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
};

// ── GET /admin/transactions ────────────────────────────────────────────────

exports.getAllTransactions = async (req, res) => {
    try {
        // Optional: ?userId=... to filter by a specific user
        const filter = {};
        if (req.query.userId) filter.userId = req.query.userId;

        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .populate("userId", "fullName email");

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: "Error fetching transactions", error: err.message });
    }
};