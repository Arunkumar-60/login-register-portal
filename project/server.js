if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  
  const express = require("express");
  const app = express();
  const bcrypt = require("bcrypt");
  const passport = require("passport");
  const flash = require("express-flash");
  const session = require("express-session");
  const initializepassport = require("/sandbox/project/passport-config");
  
  initializepassport(
    passport,
    (email) => users.find((user) => user.email === email),
    (id) => users.find((user) => user.id === id)
  );
  
  const users = [];
  
  app.set("view-engine", "ejs");
  app.use(express.urlencoded({ extended: false }));
  app.use(flash());
  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUnintialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.get("/", checkAuthenticated, (req, res) => {
    res.render("index.ejs", { name: "arun" });
  });
  
  app.get("/login", (req, res) => {
    res.render("login.ejs");
  });
  
  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })
  );
  
  app.get("/register", (req, res) => {
    res.render("register.ejs");
  });
  
  app.post("/register", async (req, res) => {
    try {
      const hashedpassword = await bcrypt.hash(req.body.password, 10);
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedpassword
      });
      res.redirect("/login");
    } catch {
      res.redirect("/register");
    }
  });
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      console.log("authenticated !!");
      return next();
    }
    console.log("sorry not authenticated");
    res.redirect("/login");
  }
  
  app.listen(3005);
  