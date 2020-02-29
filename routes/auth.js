const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const animals = require("../models/animals");


const checkRoles = require("../middlewares/checkRoles");
const { isLoggedIn, isLoggedOut } = require("../lib/isLoggedMiddleware");

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Signup
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  //Identificar usuario existente
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        username,
        password: hashPass
      })
        .then(() => {
          res.redirect("/");
        })
        .catch(error => {
          res.render("auth/signup", { errorMessage: "Something went wrong" });
        });
    })
    .catch(error => {
      next(error);
    });
});

//Login
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

//logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

//Roles
router.get("/admin", checkRoles("ADMIN"), (req, res) => {
  res.render("auth/admin", { user: req.user });
});

router.get("/fav", checkRoles("GUEST"), async (req, res) => {
  const favPets = await animals.find().where('_id').in(req.user.favPets).exec();
  res.render("auth/fav", { favPets });
});

module.exports = router;
