const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        period: { type: String, required: true },  // e.g. "2025-10" or "2025"
        fileUrl: { type: String, default: "" },
        type: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
        data: { type: mongoose.Schema.Types.Mixed },  // snapshot of aggregated data
    },
    { timestamps: true }
);

ReportSchema.index({ userId: 1 });
ReportSchema.index({ period: 1 });

module.exports = mongoose.model("Report", ReportSchema);