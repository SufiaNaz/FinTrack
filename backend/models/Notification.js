const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        type: { type: String, enum: ["budget_alert", "email", "in_app"], default: "in_app" },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ isRead: 1 });

module.exports = mongoose.model("Notification", NotificationSchema);