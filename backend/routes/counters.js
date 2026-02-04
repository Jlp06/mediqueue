const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all counters with department name
router.get("/", async (req, res) => {
    const result = await db.query(`
    SELECT counters.*, departments.name AS department_name
    FROM counters
    JOIN departments ON counters.department_id = departments.id
  `);
    res.json(result.rows);
});

// Add counter
router.post("/", async (req, res) => {
    const { name, department_id } = req.body;

    const result = await db.query(
        "INSERT INTO counters (name, department_id) VALUES ($1,$2) RETURNING *",
        [name, department_id]
    );

    res.json(result.rows[0]);
});

// Delete counter
router.delete("/:id", async (req, res) => {
    await db.query("DELETE FROM counters WHERE id=$1", [req.params.id]);
    res.json({ message: "Deleted" });
});

module.exports = router;
