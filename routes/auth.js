
const express = require("express");
const router = express.Router();
const checkRoles = require('../middlewares/checkRoles');
const ensureLogin = require('connect-ensure-login');
const { isLoggedIn, isLoggedOut } = require("../lib/isLoggedMiddleware");


const passport = require("passport");
// User model

const User = require("../models/user");

// BCrypt to encrypt passwords

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);



  //Identificar usuario existente

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ "username": username })
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
          res.redirect("/login");
        })
        .catch(error => {
          console.log(error);
        })
    })
    .catch(error => {
      next(error);
    })



});
//Get auth page
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

//Login

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});



//Post
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get('/admin', checkRoles('ADMIN'), (req, res) => {
  res.render('auth/admin', { user: req.user });
});

router.get('/fav', checkRoles('GUEST'), (req, res) => {
  res.render('auth/fav', { user: req.user });
});




module.exports = router;