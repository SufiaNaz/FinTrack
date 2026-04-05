const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
    adminLogin,
    getAdminDashboard,
    getAllUsers,
    deleteUser,
    getAllTransactions,
} = require("../controllers/adminController");

const router = express.Router();

// POST   /api/v1/admin/login         (public — no auth needed)
router.post("/login", adminLogin);

// All routes below require a valid JWT + admin role
router.use(protect, adminOnly);

// GET    /api/v1/admin/dashboard
router.get("/dashboard", getAdminDashboard);

// GET    /api/v1/admin/users
router.get("/users", getAllUsers);

// DELETE /api/v1/admin/user/:id
router.delete("/user/:id", deleteUser);

// GET    /api/v1/admin/transactions
router.get("/transactions", getAllTransactions);

module.exports = router;