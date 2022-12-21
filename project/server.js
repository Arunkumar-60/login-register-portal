if (process.env.NODE_ENV != 'production') { require('dotenv').config(); }

const express = require('express');

const req = require('express/lib/request');
//auto created

const app = express();
const bcrypt = require("bcrypt")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

const intializePassport = require('/Users/andy/Documents/GitHub/login-register-portal/project/passport-config');


intializePassport(
    passport,
    email => users.find(user => user.email === email),
    (id) => users.find((user) => user.id === id)
)



const users = [];

// rendering ejs page
app.set('view-engine', "ejs");
app.use(express.urlencoded({ extended: false }))
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())

app.get('/', checkAuthenticated, (req, res) => {
    res.render("index.ejs", { title: "Home", name: "arun" });
})

//routes

app.get("/login", (req, res) => {
    res.render("login.ejs", { title: "Login" });
})

app.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get("/register", (req, res) => {
    res.render("register.ejs", { title: "Register" })
})

app.post("/register", async (req, res) => {
    try {
        const hashedpassword = await bcrypt.hash(req.body.password, 10)
        //hasing password 10 times

        users.push({
            id: Date.now().toString,
            name: req.body.name,
            email: req.body.email,
            password: hashedpassword
        })
        res.redirect('login');
    }
    catch {
        res.redirect('/register')
    }
    console.log(users);
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(3000);