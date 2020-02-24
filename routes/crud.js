const express = require("express");
const router = express.Router();
const animals = require("../models/animals");
const users = require("../models/user");

// R : Retrieve animals
router.get("/", async (req, res) => {
  res.render("search", { user: req.user });
});

router.post("/db", async (req, res) => {
  const pet = await animals.find(req.body);
  res.json({ pet, user: req.user });
});

// Add fav
router.post("/fav", async (req, res) => {
  console.log(req.body);
  await users.findByIdAndUpdate(req.user._id, {
    $addToSet: { favPets: req.body.id }
  });
  res.end();
});

module.exports = router;
