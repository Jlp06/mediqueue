const express = require("express");
const router = express.Router();
const db = require("../db");

// Department analytics summary
router.get("/departments", async (req, res) => {
    const result = await db.query(`
    SELECT 
      d.id,
      d.name,
      COUNT(t.id) AS total_tokens,
      COUNT(CASE WHEN t.status='waiting' THEN 1 END) AS waiting,
      COUNT(CASE WHEN t.status='completed' THEN 1 END) AS completed
    FROM departments d
    LEFT JOIN tokens t ON t.department_id = d.id
    GROUP BY d.id
  `);

    res.json(result.rows);
});

module.exports = router;
