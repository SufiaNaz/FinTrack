const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    getNotifications,
    sendEmailNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// GET  /api/v1/user/notifications
router.get("/", protect, getNotifications);

// POST /api/v1/user/notify/email
router.post("/email", protect, sendEmailNotification);

module.exports = router;