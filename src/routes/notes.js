const express = require("express");
const router = express.Router();

const Note = require("../models/Note");

router.get("/add",(req,res) => {
  res.render("notes/new-note");
});

router.post("/new-note",async(req,res) => {
  const { title, description } = req.body;
  const errors = [];
  if(!title){
    errors.push({ text : "Please Write a Tile" });
  }

  if(!description){
    errors.push({ text : "Please Write a Description" });
  }

  if(errors.length > 0){
    res.render("notes/new-note", {
      errors,
      title,
      description
    });
  }else{
    const newNote = new Note({ title, description });
    await newNote.save();
    res.redirect("/notes");
  }
});

router.get("/",async(req,res) => {
  const notes = await Note.find().sort({ date : "desc" });
  res.render("notes/all-notes", { notes });
});

router.get("/edit/:id",async(req,res) => {
  const note = await Note.findById(req.params.id);
  res.render("notes/edit-note", { note });
});

router.post("/notes/edit-note/:id",async(req,res,next) => {
  const { id } = req.params;
  await Note.update({ _id : id }, req.body);
  res.redirect("/notes")
});

router.delete("/notes/delete/:id",(req,res) => {
  console.log(req.params.id);
  res.send("Ok")
});

module.exports = router;