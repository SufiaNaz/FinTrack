// adminMiddleware.js
// Use AFTER protect middleware. Checks that req.user.role === "admin".

exports.adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};