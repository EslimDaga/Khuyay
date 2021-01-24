const express = require("express");
const router = express.Router();
const pool = require("../database");

router.get("/add", (req,res) => {
  res.render("links/add");
});

router.post("/add", async(req,res) => {
  const { title, url, description } = req.body;
  const newLink = { title, url, description };
  await pool.query("INSERT INTO links SET ?", [newLink]);
  req.flash("success", "Link Saved Successfully");
  res.redirect("/links");
});

router.get("/", async(req,res) => {
  const links = await pool.query("SELECT * FROM links");
  res.render("links/index", { links });
});

router.get("/delete/:id", async(req,res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM links WHERE ID = ?", [id]);
  req.flash("success","Link Removed Successfully");
  res.redirect("/links");
});

router.get("/edit/:id", async(req,res) => {
  const { id } = req.params;
  const links = await pool.query("SELECT * FROM links WHERE id = ?", [id]);
  console.log(links);
  res.render("links/edit", { links : links[0] })
});

router.post("/edit/:id", async(req,res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  const newLink = { title, description, url };
  req.flash("success","Link Updated Successfully");
  await pool.query("UPDATE links set ? WHERE id = ?", [newLink, id]);
  res.redirect("/links");
});

module.exports = router;