const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getDashboard, getSummary } = require("../controllers/dashboardController");

const router = express.Router();

// GET /api/v1/user/dashboard
router.get("/dashboard", protect, getDashboard);

// GET /api/v1/user/summary
router.get("/summary", protect, getSummary);

module.exports = router;