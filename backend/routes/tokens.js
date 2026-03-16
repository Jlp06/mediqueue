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
    const { department_id, user_id } = req.body;

    const last = await db.query("SELECT MAX(token_number) FROM tokens");
    const token_number = (last.rows[0].max || 0) + 1;

    const result = await db.query(
        "INSERT INTO tokens (token_number, department_id, counter_id, user_id) VALUES ($1,$2,$3,$4) RETURNING *",
        [token_number, department_id, 1, user_id]
    );

    res.json(result.rows[0]);
});

//Serve next token
router.post("/serve-next", async (req, res) => {
    try {
        const { counter_id } = req.body;

        const tokenRes = await db.query(
            "SELECT * FROM tokens WHERE status='waiting' ORDER BY id LIMIT 1"
        );

        if (!tokenRes.rows.length) {
            return res.json({ message: "No waiting tokens" });
        }

        const token = tokenRes.rows[0];

        // Use provided counter_id or fall back to auto-picking
        let counter;
        if (counter_id) {
            const counterRes = await db.query(
                "SELECT * FROM counters WHERE id=$1", [counter_id]
            );
            counter = counterRes.rows[0];
        } else {
            const counterRes = await db.query(
                "SELECT * FROM counters WHERE active=true ORDER BY id LIMIT 1"
            );
            counter = counterRes.rows[0];
        }

        if (!counter) return res.json({ message: "No counters available" });

        await db.query("UPDATE tokens SET status='completed' WHERE status='serving'");
        await db.query(
            "UPDATE tokens SET status='serving', counter_id=$1 WHERE id=$2",
            [counter.id, token.id]
        );

        const io = req.app.get("io");
        io.emit("tokenUpdate");

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
