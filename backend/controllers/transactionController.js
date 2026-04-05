const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Notification = require("../models/Notification");

// ── POST /user/transaction ─────────────────────────────────────────────────

exports.addTransaction = async (req, res) => {
    const userId = req.user.id;
    const { type, category, amount, description, date, icon } = req.body;

    if (!type || !category || !amount) {
        return res.status(400).json({ message: "type, category, and amount are required" });
    }

    if (!["income", "expense"].includes(type)) {
        return res.status(400).json({ message: "type must be 'income' or 'expense'" });
    }

    try {
        const transaction = await Transaction.create({
            userId,
            type,
            category,
            amount,
            description: description || "",
            date: date ? new Date(date) : Date.now(),
            icon: icon || "",
        });

        // ── Budget alert check (only for expense transactions) ─────────────
        if (type === "expense") {
            const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
            const budget = await Budget.findOne({ userId, month: currentMonth });

            if (budget) {
                budget.spent += amount;
                await budget.save();

                const usagePercent = (budget.spent / budget.amount) * 100;

                // Alert at 80% threshold per TRS
                if (usagePercent >= 80 && usagePercent - (amount / budget.amount) * 100 < 80) {
                    await Notification.create({
                        userId,
                        message: `⚠️ You have used ${Math.round(usagePercent)}% of your budget for ${currentMonth}.`,
                        type: "budget_alert",
                    });
                }

                // Alert at 100% (exceeded)
                if (usagePercent >= 100 && budget.spent - amount < budget.amount) {
                    await Notification.create({
                        userId,
                        message: `🚨 You have exceeded your budget for ${currentMonth}!`,
                        type: "budget_alert",
                    });
                }
            }
        }

        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: "Error adding transaction", error: err.message });
    }
};

// ── GET /user/transaction ──────────────────────────────────────────────────

exports.getAllTransactions = async (req, res) => {
    const userId = req.user.id;

    try {
        // Optional filters: ?type=income&category=food&from=2025-01-01&to=2025-12-31
        const filter = { userId };
        if (req.query.type) filter.type = req.query.type;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.from || req.query.to) {
            filter.date = {};
            if (req.query.from) filter.date.$gte = new Date(req.query.from);
            if (req.query.to) filter.date.$lte = new Date(req.query.to);
        }

        const transactions = await Transaction.find(filter).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: "Error fetching transactions", error: err.message });
    }
};

// ── PUT /user/transaction/:id ──────────────────────────────────────────────

exports.updateTransaction = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { type, category, amount, description, date, icon } = req.body;

    try {
        const transaction = await Transaction.findOne({ _id: id, userId });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (type) transaction.type = type;
        if (category) transaction.category = category;
        if (amount) transaction.amount = amount;
        if (description !== undefined) transaction.description = description;
        if (date) transaction.date = new Date(date);
        if (icon !== undefined) transaction.icon = icon;

        await transaction.save();
        res.status(200).json(transaction);
    } catch (err) {
        res.status(500).json({ message: "Error updating transaction", error: err.message });
    }
};

// ── DELETE /user/transaction/:id ───────────────────────────────────────────

exports.deleteTransaction = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const transaction = await Transaction.findOneAndDelete({ _id: id, userId });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting transaction", error: err.message });
    }
};