const express = require("express");
const router = express.Router()

router.get("/signin",(req,res) => {
  res.send("Login");
});

router.get("/signup",(req,res) => {
  res.send("Register");
});

module.exports = router;