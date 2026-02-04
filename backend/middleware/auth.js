const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "jwt_secret_key");
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

function authorizeAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
}

module.exports = { authenticate, authorizeAdmin };
