const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// ── POST /user/budget ──────────────────────────────────────────────────────
// Create or update a budget for a given month

exports.createBudget = async (req, res) => {
    const userId = req.user.id;
    const { month, amount } = req.body;

    if (!month || !amount) {
        return res.status(400).json({ message: "month and amount are required" });
    }

    // month should be "YYYY-MM"
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
        return res.status(400).json({ message: "month must be in YYYY-MM format (e.g. 2025-10)" });
    }

    try {
        // Calculate already-spent amount for that month from existing transactions
        const [monthStart, monthEnd] = getMonthRange(month);
        const expenseAgg = await Transaction.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    type: "expense",
                    date: { $gte: monthStart, $lte: monthEnd },
                },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const spent = expenseAgg[0]?.total || 0;

        // Upsert: one budget per user per month
        const budget = await Budget.findOneAndUpdate(
            { userId, month },
            { amount, spent, isActive: true },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(201).json(budget);
    } catch (err) {
        res.status(500).json({ message: "Error creating budget", error: err.message });
    }
};

// ── POST /user/budget/status ───────────────────────────────────────────────
// Activate or deactivate a budget entry

exports.updateBudgetStatus = async (req, res) => {
    const userId = req.user.id;
    const { month, isActive } = req.body;

    if (!month || isActive === undefined) {
        return res.status(400).json({ message: "month and isActive are required" });
    }

    try {
        const budget = await Budget.findOneAndUpdate(
            { userId, month },
            { isActive },
            { new: true }
        );

        if (!budget) {
            return res.status(404).json({ message: "Budget not found for that month" });
        }

        res.status(200).json(budget);
    } catch (err) {
        res.status(500).json({ message: "Error updating budget status", error: err.message });
    }
};

// ── Helper ─────────────────────────────────────────────────────────────────

function getMonthRange(monthStr) {
    const [year, month] = monthStr.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    return [start, end];
}