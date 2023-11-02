if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const req = require('express/lib/request');
//auto created
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session')


//intialize passport
const intializePassport = require('/Users/andy/Documents/GitHub/login-register-portal/project/passport-config');
intializePassport(passport,
    email => users.find((user) => user.email === email),
    id => users.find((user) => user.id === id))


//for storing user list locally
const users = [];

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnintialized: false
}))
//asking app to use flash ad session
app.use(passport.initialize())


app.get('/', (req, res) => {
    // to render the ejs file
    res.render('index.ejs', { name: 'arun' });
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
})
//routes

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

//post method for login page

app.post('/login', passport.authenticate('local', {
    //login success erdirect
    successRedirect: '/',
    //login fail redirect
    failureRedirect: '/login',
    //logi flash alert messages
    failureFlash: true
}))

// as hashing is an asyncronus code 
// that will be runing in the backgroud 
// so the post method should be async too

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
        //this hashed  password 10 times
        //we can put the number as anyt integer , moer the number not layers of encryption 
        // await as bcrypt or hashing is a asyccronus code 
        //pushing the info of users into list
    }
    catch {
        res.redirect('/register');
        //if failed redirecting to register page
    }
    console.log(users);
    //to test whats getting saved in the usersn
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();

    }
    res.redirect('/login')
}
app.listen(3000);

