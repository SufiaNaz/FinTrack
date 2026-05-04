const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

// ── GET /user/dashboard ────────────────────────────────────────────────────
// Returns: total income, total expense, net balance, recent transactions,
//          category breakdown, current month budget status

exports.getDashboard = async (req, res) => {
    const userId = req.user.id;

    try {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        // All-time totals
        const [incomeAgg, expenseAgg] = await Promise.all([
            Transaction.aggregate([
                { $match: { userId: req.user._id, type: "income" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
            Transaction.aggregate([
                { $match: { userId: req.user._id, type: "expense" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
        ]);

        const totalIncome = incomeAgg[0]?.total || 0;
        const totalExpense = expenseAgg[0]?.total || 0;
        const netBalance = totalIncome - totalExpense;

        // Current month totals
        const [monthIncome, monthExpense] = await Promise.all([
            Transaction.aggregate([
                { $match: { userId: req.user._id, type: "income", date: { $gte: currentMonthStart, $lte: currentMonthEnd } } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
            Transaction.aggregate([
                { $match: { userId: req.user._id, type: "expense", date: { $gte: currentMonthStart, $lte: currentMonthEnd } } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
        ]);

        // Recent 5 transactions
        const recentTransactions = await Transaction.find({ userId: req.user._id })
            .sort({ date: -1 })
            .limit(5);

        // Category breakdown (expense) for current month
        const categoryBreakdown = await Transaction.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    type: "expense",
                    date: { $gte: currentMonthStart, $lte: currentMonthEnd },
                },
            },
            { $group: { _id: "$category", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } },
        ]);

        // Current budget status
        const currentMonthStr = now.toISOString().slice(0, 7);
        const budget = await Budget.findOne({ userId: req.user._id, month: currentMonthStr });

        res.status(200).json({
            totalIncome,
            totalExpense,
            netBalance,
            currentMonth: {
                income: monthIncome[0]?.total || 0,
                expense: monthExpense[0]?.total || 0,
            },
            recentTransactions,
            categoryBreakdown,
            budget: budget
                ? {
                      limit: budget.amount,
                      spent: budget.spent,
                      remaining: budget.amount - budget.spent,
                      usagePercent: Math.round((budget.spent / budget.amount) * 100),
                  }
                : null,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching dashboard", error: err.message });
    }
};

// ── GET /user/summary ──────────────────────────────────────────────────────
// Returns: monthly income vs expense for ALL time (frontend handles filtering)

exports.getSummary = async (req, res) => {
    try {
        const summary = await Transaction.aggregate([
            {
                $match: {
                    userId: req.user._id,   // no date filter — return everything
                },
            },
            {
                $group: {
                    _id: {
                        year:  { $year:  "$date" },
                        month: { $month: "$date" },
                        type:  "$type",
                    },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Shape: [{ month: "2025-04", income: X, expense: Y }, ...]
        const formatted = {};
        summary.forEach(({ _id, total }) => {
            const key = `${_id.year}-${String(_id.month).padStart(2, "0")}`;
            if (!formatted[key]) formatted[key] = { month: key, income: 0, expense: 0 };
            formatted[key][_id.type] = total;
        });

        res.status(200).json(Object.values(formatted).sort((a, b) => a.month.localeCompare(b.month)));
    } catch (err) {
        res.status(500).json({ message: "Error fetching summary", error: err.message });
    }
};