const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        month: { type: String, required: true },   // e.g. "2025-10"
        amount: { type: Number, required: true },  // budget limit
        spent: { type: Number, default: 0 },       // auto-updated from transactions
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

BudgetSchema.index({ userId: 1 });
BudgetSchema.index({ month: 1 });

module.exports = mongoose.model("Budget", BudgetSchema);