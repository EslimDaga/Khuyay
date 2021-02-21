const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/", isLoggedIn,async(req,res) => {
  const verses = await pool.query("SELECT * FROM verses WHERE user_id = ?", [req.user.id]);
  res.render("verses/index", { verses });
});

router.get("/add", isLoggedIn,(req,res) => {
  res.render("verses/add");
});

router.post("/add", isLoggedIn,async(req,res) => {
  const { title, description } = req.body;
  const image = req.file.filename;
  const newVerse = { title, description, image, user_id : req.user.id };
  await pool.query("INSERT INTO verses SET ?", [newVerse]);
  req.flash("success", "Verso guardado satisfactoriamente");
  res.render("verses/index");
});


router.get("/delete/:id_verse", isLoggedIn,async(req,res) => {
  const { id_verse } = req.params;
  await pool.query("DELETE FROM verses WHERE ID_VERSE = ?", [id_verse]);
  req.flash("success","Verso eliminado satisfactoriamente");
  res.redirect("/verses");
});

router.get("/edit/:id_verse", isLoggedIn,async(req,res) => {
  const { id_verse } = req.params;
  const verses = await pool.query("SELECT * FROM verses WHERE id_verse = ?", [id_verse]);
  console.log(verses);
  res.render("verses/edit", { verses : verses[0] });
});

router.post("/edit/:id_verse", isLoggedIn,async(req, res) => {
  const { id_verse } = req.params;
  const { title, description } = req.body;
  const image = req.file.filename;
  const newVerse = { title, description, image };
  req.flash("success", "Verso actualizado satisfaccioriamente");
  await pool.query("UPDATE verses set ? WHERE id_verse = ?", [newVerse, id_verse]);
  res.redirect("/verses");
});

router.get("/view/:id_verse", isLoggedIn,async(req,res) => {
  const { id_verse } = req.params;
  const verses = await pool.query("SELECT * FROM verses WHERE id_verse = ?", [id_verse]);
  console.log(verses);
  res.render("verses/view", { verses : verses[0] });
});

module.exports = router;