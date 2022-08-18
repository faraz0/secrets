require('dotenv').config();
const express = require("express");
const app = express();
const bp = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(bp.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'))
//connect to a database
mongoose.connect('mongodb://localhost:27017/userDB');
//Schema
const userSchema = new mongoose.Schema({
  usr: String,
  pwd: String
});
//Encryption plugin
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['pwd'] });
//Model DB
const User = mongoose.model("User", userSchema);

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
  res.render("home");
});




//all post methods
//1. register
app.post("/register", function(req,res){
  console.log(req.body);
  User.findOne({usr:req.body.username}, function(err, user){
    if(!err){
      if(user) res.send("<h1>User already exists</h1>");
      else{
        const password=req.body.password;
        bcrypt.hash(password, saltRounds, function(err, hash) {
          const newUser = new User({
            usr: req.body.username,
            pwd: hash
          }).save(function(err){
            if(err) console.log(err);
            else console.log("New User added successfully");
          });
        });

        res.render("secrets");
      }
    }
    else console.log(err);
  });
});

app.post("/login", function(req,res){
  User.findOne({usr:req.body.username}, function(err, user){
    if(!err){
      if(user){
      const password=req.body.password;
      bcrypt.compare(password, user.pwd, function(err, result) {
        if(result === true){
          res.render("secrets");
        }
    // if(user.pwd===password){
    //
    //   });
    // }
      else{
      console.log("Password Incorrect. Try again with correct passowrd");
      res.redirect("/login");
    }
      });

    }else{
      console.log("No user with this id found");
      res.render("/login");
    }
  }
  });
});

app.post("/submit", function(req, res){

});













app.listen(3000, function(err){
  if(!err){
    console.log("Started server at port 3000...")
  }
});
