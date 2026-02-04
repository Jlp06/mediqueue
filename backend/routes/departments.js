const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all departments
router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM departments ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ADD department
router.post("/", async (req, res) => {
    const { name, counters, doctors } = req.body;

    try {
        const result = await db.query(
            "INSERT INTO departments (name, counters, doctors) VALUES ($1,$2,$3) RETURNING *",
            [name, counters, doctors]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Insert failed" });
    }
});

// DELETE department
router.delete("/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM departments WHERE id=$1", [req.params.id]);
        res.json({ message: "Deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Delete failed" });
    }
});

module.exports = router;
