const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const { authenticate, authorizeAdmin } = require("./middleware/auth");

const router = express.Router();

/* TEST */
router.get("/test", (req, res) => {
    res.send("Routes working");
});

/* REGISTER */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await pool.query(
            "SELECT 1 FROM auth_users WHERE email = $1",
            [email]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO auth_users (name, email, password_hash)
       VALUES ($1,$2,$3)
       RETURNING id, name, email`,
            [name, email, hash]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Register failed" });
    }
});

/* LOGIN */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM auth_users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];
        const ok = await bcrypt.compare(password, user.password_hash);

        if (!ok) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            "jwt_secret_key",
            { expiresIn: "1h" }
        );

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
});

/* GENERATE TOKEN */
router.post("/token", async (req, res) => {
    try {
        const { user_id } = req.body;

        // prevent duplicate token for same user
        const exists = await pool.query(
            "SELECT * FROM queue WHERE user_id = $1",
            [user_id]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({
                message: "Token already exists",
                token_number: exists.rows[0].token_number,
            });
        }

        const result = await pool.query(
            "INSERT INTO queue (user_id) VALUES ($1) RETURNING token_number",
            [user_id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Token generation failed" });
    }
});

/* GET QUEUE */
router.get("/queue", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT token_number, user_id FROM queue ORDER BY token_number ASC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch queue" });
    }
});

//serve next patient
router.post("/queue/next", authenticate, authenticate, authorizeAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM queue WHERE token_number = (SELECT token_number FROM queue ORDER BY token_number ASC LIMIT 1) RETURNING *"
        );

        if (result.rows.length === 0) {
            return res.json({ message: "Queue empty" });
        }

        res.json({
            message: "Patient served",
            served: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to serve patient" });
    }
});

router.delete("/queue/:token", async (req, res) => {
    const { token } = req.params;

    await pool.query(
        "DELETE FROM queue WHERE token_number = $1",
        [token]
    );

    res.json({ message: "Token removed" });
});

module.exports = router;
