const express = require("express");
const router = express.Router();
const db = require("../db");

// Get queue
router.get("/", async (req, res) => {
    const result = await db.query(`
    SELECT tokens.*, departments.name AS department_name, counters.name AS counter_name
    FROM tokens
    LEFT JOIN departments ON tokens.department_id = departments.id
    LEFT JOIN counters ON tokens.counter_id = counters.id
    ORDER BY tokens.id ASC
  `);
    res.json(result.rows);
});

// Generate token
router.post("/generate", async (req, res) => {
    const { department_id } = req.body;

    const last = await db.query("SELECT MAX(token_number) FROM tokens");
    const token_number = (last.rows[0].max || 0) + 1;

    const result = await db.query(
        "INSERT INTO tokens (token_number, department_id) VALUES ($1,$2) RETURNING *",
        [token_number, department_id]
    );

    res.json(result.rows[0]);
});

// Serve next token
router.post("/serve-next", async (req, res) => {
    try {
        // Get next waiting token
        const tokenRes = await db.query(
            "SELECT * FROM tokens WHERE status='waiting' ORDER BY id LIMIT 1"
        );

        if (!tokenRes.rows.length) {
            return res.json({ message: "No waiting tokens" });
        }

        const token = tokenRes.rows[0];

        // Get any active counter
        const counterRes = await db.query(
            "SELECT * FROM counters WHERE active=true ORDER BY id LIMIT 1"
        );

        if (!counterRes.rows.length) {
            return res.json({ message: "No counters available" });
        }

        const counter = counterRes.rows[0];

        // Mark previous serving token as completed
        await db.query("UPDATE tokens SET status='completed' WHERE status='serving'");

        // Mark this token as serving + assign counter
        await db.query(
            "UPDATE tokens SET status='serving', counter_id=$1 WHERE id=$2",
            [counter.id, token.id]
        );
        
        const io = req.app.get("io");

        io.emit("tokenUpdate"); // notify all screens

        // Return updated token
        res.json({
            token_number: token.token_number,
            counter: counter.name,
            id: token.id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Serve next failed" });
    }
});

// Complete token
router.post("/complete/:id", async (req, res) => {
    await db.query("UPDATE tokens SET status='completed' WHERE id=$1", [req.params.id]);
    res.json({ message: "Completed" });
});

module.exports = router;
