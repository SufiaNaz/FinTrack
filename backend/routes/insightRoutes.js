const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { generateInsights } = require("../controllers/insightController");

const router = express.Router();

// POST /api/v1/user/insights
router.post("/", protect, generateInsights);

module.exports = router;