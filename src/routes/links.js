const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/", isLoggedIn, async (req, res) => {
  const links = await pool.query("SELECT * FROM links WHERE user_id = ?", [req.user.id]);
  res.render("links/index", { links });
});

router.get("/add", isLoggedIn,(req,res) => {
  res.render("links/add");
});

router.post("/add", isLoggedIn,async(req,res) => {
  const { title, url, description } = req.body;
  const newLink = { title, url, description, user_id : req.user.id };
  await pool.query("INSERT INTO links SET ?", [newLink]);
  req.flash("success", "Link Saved Successfully");
  res.redirect("/links");
});

router.get("/delete/:id", isLoggedIn,async(req,res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM links WHERE ID = ?", [id]);
  req.flash("success","Link Removed Successfully");
  res.redirect("/links");
});

router.get("/edit/:id", isLoggedIn,async(req,res) => {
  const { id } = req.params;
  const links = await pool.query("SELECT * FROM links WHERE id = ?", [id]);
  console.log(links);
  res.render("links/edit", { links : links[0] });
});

router.post("/edit/:id", isLoggedIn,async(req,res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  const newLink = { title, description, url };
  req.flash("success","Link Updated Successfully");
  await pool.query("UPDATE links set ? WHERE id = ?", [newLink, id]);
  res.redirect("/links");
});

module.exports = router;