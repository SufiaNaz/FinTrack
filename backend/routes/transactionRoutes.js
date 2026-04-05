const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    addTransaction,
    getAllTransactions,
    updateTransaction,
    deleteTransaction,
} = require("../controllers/transactionController");

const router = express.Router();

// POST   /api/v1/user/transaction
router.post("/", protect, addTransaction);

// GET    /api/v1/user/transaction
router.get("/", protect, getAllTransactions);

// PUT    /api/v1/user/transaction/:id
router.put("/:id", protect, updateTransaction);

// DELETE /api/v1/user/transaction/:id
router.delete("/:id", protect, deleteTransaction);

module.exports = router;