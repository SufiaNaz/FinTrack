const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    getUserInfo,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.post("/forgot-password", forgotPassword);
router.get("/getUser", protect, getUserInfo);

module.exports = router;