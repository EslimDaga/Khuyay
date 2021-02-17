const express = require("express");
const pool = require("../database");
const router = express.Router();

router.get("/add", (req,res) => {
  res.render("verses/add");
});

router.post("/add", async(req,res) => {
  const { title, description } = req.body;
  const newVerse = { title, description, user_id : req.user.id };
  await pool.query("INSERT INTO verses SET ?", [newVerse]);
  req.flash("success", "Verso guardado satisfactoriamente");
  res.redirect("/verses");
});

router.get("/", async(req,res) => {
  const verses = await pool.query("SELECT * FROM verses WHERE user_id = ?", [req.user.id]);
  res.render("verses/index", { verses });
});

router.get("/edit/:id_verse", async(req,res) => {
  const { id_verse } = req.params;
  const verses = await pool.query("SELECT * FROM verses WHERE id_verse = ?", [id_verse]);
  console.log(verses);
  res.render("verses/edit", { verses : verses[0] });
});

module.exports = router;