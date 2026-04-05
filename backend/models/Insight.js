const mongoose = require("mongoose");

const InsightSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

InsightSchema.index({ userId: 1 });

module.exports = mongoose.model("Insight", InsightSchema);