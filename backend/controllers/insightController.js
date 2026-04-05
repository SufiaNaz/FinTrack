const Transaction = require("../models/Transaction");
const Insight = require("../models/Insight");

// ── POST /user/insights ────────────────────────────────────────────────────
// Generates rule-based financial insights from user's transaction data.
// Swap generateRuleBasedInsights() with an OpenAI/Gemini API call for true AI.

exports.generateInsights = async (req, res) => {
    const userId = req.user.id;

    try {
        const now = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);

        const transactions = await Transaction.find({
            userId: req.user._id,
            date: { $gte: threeMonthsAgo },
        });

        if (transactions.length === 0) {
            return res.status(200).json({
                insights: ["Add some transactions first to get personalised insights."],
            });
        }

        const insights = generateRuleBasedInsights(transactions);

        // Persist insights
        const savedInsights = await Promise.all(
            insights.map((message) =>
                Insight.create({ userId: req.user._id, message })
            )
        );

        res.status(200).json({ insights: savedInsights });
    } catch (err) {
        res.status(500).json({ message: "Error generating insights", error: err.message });
    }
};

// ── Rule-based insight engine ──────────────────────────────────────────────
// Replace or extend this with an LLM API call (OpenAI, Gemini, Claude, etc.)

function generateRuleBasedInsights(transactions) {
    const insights = [];

    const income = transactions.filter((t) => t.type === "income");
    const expenses = transactions.filter((t) => t.type === "expense");

    const totalIncome = income.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    // Savings rate insight
    if (savingsRate < 10 && totalIncome > 0) {
        insights.push(
            `Your savings rate is only ${Math.round(savingsRate)}% over the last 3 months. Financial advisors recommend saving at least 20% of income.`
        );
    } else if (savingsRate >= 20) {
        insights.push(
            `Great work! You've maintained a ${Math.round(savingsRate)}% savings rate over the last 3 months.`
        );
    }

    // Top spending category
    const categoryTotals = {};
    expenses.forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0) {
        const [topCat, topAmt] = sortedCategories[0];
        const pct = Math.round((topAmt / totalExpense) * 100);
        insights.push(
            `Your highest spending category is "${topCat}" at ₹${topAmt} (${pct}% of total expenses).`
        );
    }

    // Expense-to-income ratio warning
    if (totalIncome > 0 && totalExpense / totalIncome > 0.9) {
        insights.push(
            "Your expenses are consuming over 90% of your income. Consider reviewing discretionary spending."
        );
    }

    // No income recorded
    if (income.length === 0) {
        insights.push("No income recorded in the last 3 months. Make sure to log your income sources.");
    }

    if (insights.length === 0) {
        insights.push("Your finances look balanced! Keep tracking to get more tailored insights.");
    }

    return insights;
}