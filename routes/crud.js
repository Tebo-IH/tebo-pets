const express = require("express");
const router = express.Router();
const animals = require("../models/animals");

// R : Retrieve animals
router.get("/", async (req, res) => {
  // const pet = await animals.find({ name: "Kyle" });
  //res.render("search", { pet });
  res.render("search", { user: req.user });
});

router.post("/db", async (req, res) => {
  const pet = await animals.find(req.body);
  res.json(pet);
});

/*
// R : Retrieve details of a particular celeb
router.get("/show/:id", async (req, res) => {
  const { id } = req.params;
  const celebrity = await Celebrity.findById(id);
  res.render("celebrities/show", { celebrity });
});*/

module.exports = router;
