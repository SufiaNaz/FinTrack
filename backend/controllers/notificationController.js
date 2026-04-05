const Notification = require("../models/Notification");
// Uncomment after configuring nodemailer:
 const nodemailer = require("nodemailer");

// ── GET /user/notifications ────────────────────────────────────────────────

exports.getNotifications = async (req, res) => {
    const userId = req.user.id;

    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        // Mark all as read after fetching
        await Notification.updateMany(
            { userId: req.user._id, isRead: false },
            { isRead: true }
        );

        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications", error: err.message });
    }
};

// ── POST /user/notify/email ────────────────────────────────────────────────
// Body: { subject: "...", message: "..." }

exports.sendEmailNotification = async (req, res) => {
    const { subject, message } = req.body;
    const user = req.user;

    if (!subject || !message) {
        return res.status(400).json({ message: "subject and message are required" });
    }

    try {
        // ── Nodemailer config ──────────────────────────────────────────────
         //Set in .env: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
        
         const transporter = nodemailer.createTransport({
             host: process.env.EMAIL_HOST,
             port: process.env.EMAIL_PORT,
             auth: {
                 user: process.env.EMAIL_USER,
                 pass: process.env.EMAIL_PASS,
             },
         });
        
         await transporter.sendMail({
             from: `"FinTrack" <${process.env.EMAIL_USER}>`,
             to: user.email,
             subject,
             html: `<p>${message}</p>`,
         });

        // Also save as in-app notification
        const notification = await Notification.create({
            userId: user._id,
            message,
            type: "email",
        });

        res.status(200).json({
            message: "Email notification sent",
            notification,
            note: "Configure Nodemailer in notificationController.js to actually send emails",
        });
    } catch (err) {
        res.status(500).json({ message: "Error sending email notification", error: err.message });
    }
};