const express = require("express");
const pool = require("../database");
const router = express.Router();

router.get("/", async(req,res) => {
  const verses = await pool.query("SELECT * FROM verses WHERE user_id = ?", [req.user.id]);
  res.render("verses/index", { verses });
});

module.exports = router;