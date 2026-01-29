const { protect } = require("../middleware/authMiddleware");

const express = require("express");

const {
    registerUser,
    loginUser,
   // getUserInfo,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", (req, res, next) => {
    console.log("Request body:", req.body);
    registerUser(req, res, next); // pass next just in case
});


router.post("/login", loginUser);

// router.get("/getUser", protect, getUserInfo);



module.exports = router;