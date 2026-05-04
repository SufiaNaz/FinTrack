const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// Uncomment when nodemailer is configured:
 const nodemailer = require("nodemailer");

// ── Helpers ────────────────────────────────────────────────────────────────

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── POST /user/register ────────────────────────────────────────────────────

exports.registerUser = async (req, res) => {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !phone || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const user = await User.create({ fullName, phone, email, password });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

// ── POST /user/login ───────────────────────────────────────────────────────

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Destructure out sensitive fields
        const { password: _, resetPasswordToken, resetPasswordExpires, ...safeUser } = user._doc;

        res.status(200).json({
            id: user._id,
            user: safeUser,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
};

// ── POST /user/logout ──────────────────────────────────────────────────────
// JWT is stateless — logout is handled client-side by discarding the token.
// If you add a token blacklist (Redis), invalidate here.

exports.logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error logging out", error: err.message });
    }
};

// ── POST /user/forgot-password ─────────────────────────────────────────────

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });

        // Always respond 200 to prevent user enumeration
        if (!user) {
            return res.status(200).json({
                message: "If that email exists, a reset link has been sent",
            });
        }

        // Generate a secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // ── Send email via Nodemailer ──────────────────────────────────────
        // Configure .env: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
        //
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
             subject: "Password Reset Request",
             html: `<p>Click the link below to reset your password (valid 1 hour):</p>
                    <a href="${resetUrl}">${resetUrl}</a>`,
         });

        // Temporary: return the URL directly (remove in production)  
        res.status(200).json({
            message: "If that email exists, a reset link has been sent",
            resetUrl, // REMOVE IN PRODUCTION
        });
    } catch (err) {
        res.status(500).json({ message: "Error sending reset email", error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Hash the token from URL to compare with stored hash
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // not expired
        });

        if (!user) {
            return res.status(400).json({ message: "Reset link is invalid or expired" });
        }

        user.password = password; // make sure your User model hashes on save
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ── GET /user/getUser ──────────────────────────────────────────────────────

exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
};