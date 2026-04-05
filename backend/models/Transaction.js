const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["income", "expense"], required: true },
        category: { type: String, required: true },
        amount: { type: Number, required: true },
        description: { type: String, default: "" },
        date: { type: Date, default: Date.now },
        icon: { type: String, default: "" },
    },
    { timestamps: true }
);

// Indexes per TRS indexing strategy
TransactionSchema.index({ userId: 1 });
TransactionSchema.index({ date: 1 });
TransactionSchema.index({ category: 1 });

module.exports = mongoose.model("Transaction", TransactionSchema);