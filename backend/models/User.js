const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        currency: { type: String, default: "INR" },
        salary: { type: Number, default: 0 },
        profileImageUrl: { type: String, default: null },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
    },
    { timestamps: true }
);

// Indexes per TRS
UserSchema.index({ role: 1 });

// Hash password before saving
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);