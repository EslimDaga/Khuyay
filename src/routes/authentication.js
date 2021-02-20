const express = require("express");
const router = express.Router();
const passport = require("passport");
const pool = require("../database");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");

router.get("/signup", isNotLoggedIn,(req,res) => {
  res.render("auth/signup");
});

router.post("/signup", isNotLoggedIn,passport.authenticate("local.signup",{
  successRedirect : "/profile",
  failureRedirect : "/signup",
  failureFlash : true
}));

router.get("/signin", isNotLoggedIn,(req,res) => {
  res.render("auth/signin");
});

router.post("/signin", isNotLoggedIn,(req, res, next) => {
  passport.authenticate("local.signin", {
    successRedirect : "/profile",
    failureRedirect : "/signin",
    failureFlash : true
  })(req, res, next);
});

router.get("/profile", isLoggedIn,(req,res) => {
  res.render("profile");
});

router.get("/profile/edit/:id", async(req,res) => {
  const { id } = req.params;
  const users = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  console.log(users);
  res.render("users/edit", { users : users[0] });
});

router.post("/profile/edit/:id", async(req,res) => {
  const { id } = req.params;
  const { firstname, lastname, username, email, phone } = req.body;
  const image = req.file.filename;
  const newUser = { firstname, lastname, username, email, phone, image };
  req.flash("success","Usuario actualizado satisfactoriamente");
  await pool.query("UPDATE users set ? WHERE id = ?", [newUser, id]);
  res.redirect("/profile");
});

router.get("/logout", isLoggedIn,(req,res) => {
  req.logOut();
  res.redirect("/signin");
});

module.exports = router;