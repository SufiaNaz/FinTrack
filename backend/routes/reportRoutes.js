const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getReport, exportReport } = require("../controllers/reportController");

const router = express.Router();

// GET  /api/v1/user/report/:period  (e.g. /report/2025-10 or /report/2025)
router.get("/:period", protect, getReport);

// POST /api/v1/user/report/export
router.post("/export", protect, exportReport);

module.exports = router;