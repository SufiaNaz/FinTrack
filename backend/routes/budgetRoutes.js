const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createBudget, updateBudgetStatus } = require("../controllers/budgetController");

const router = express.Router();

// POST /api/v1/user/budget
router.post("/", protect, createBudget);

// POST /api/v1/user/budget/status
router.post("/status", protect, updateBudgetStatus);

module.exports = router;