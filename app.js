require('dotenv').config();
const express = require("express");
const app = express();
const bp = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
const passport = require('passport');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

app.use(bp.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(passport.initialize());
app.use(passport.session());

//connect to a database
mongoose.connect('mongodb://localhost:27017/userDB');
//Schema
const userSchema = new mongoose.Schema({
  username : String,
  password: String
});
//Encryption plugin
userSchema.plugin(passportLocalMongoose);

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
//Model DB
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//All get methods
app.get("/", function(req, res){
  res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/logout", function(req, res){
  req.logout(function(err){
    if(err) console.log(err);
  });
  res.render("home");
});

app.get("/secrets", function(req, res){
  if(req.isAuthenticated()){
    res.render("secrets");
  } else {
    res.redirect("/login");
}
});




//all post methods

app.post("/register", function(req,res){
  User.register({username:req.body.username, active: false}, req.body.password, function(err, user) {
    if (err){
      console.log(err);
      res.redirect("/register");
    }
    else{

      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets")
      });
    }
});
});

app.post("/login", function(req,res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
    req.login(user, function(err){
      if(!err){
        passport.authenticate("local")(req,res,function(){
          res.redirect("/secrets")
        });
      }
      else console.log(err);
    });
  });

// app.post("/submit", function(req, res){
//
// });













app.listen(3000, function(err){
  if(!err){
    console.log("Started server at port 3000...")
  }
});
