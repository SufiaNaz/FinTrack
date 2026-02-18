const User = require('../models/User');
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
exports.registerUser = async (req, res) => {
    const { fullName, phone, email, password } = req.body;

    // Validation: Check for missing fields
    if (!fullName || !phone || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }  

    try {
        console.log("REQ BODY:", req.body);

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        
  

        // Create the User
        const user = await User.create({
            fullName,
            phone,
            email,
            password,
        });
        console.log("USER CREATED:", user);

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res
           .status(500)
           .json({ message: "Error registering user", error: err.message});
    }
}; 

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required "});
    }
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        res.status(200).json({
            id: User._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res
           .status(500)
           .json({ message: "Error loging in", error: err.message});
    }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res
           .status(500)
           .json({ message: "Error finding user", error: err.message});
    }
};
