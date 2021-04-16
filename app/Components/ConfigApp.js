const express = require("express")
const app = express()
const session = require("express-session")
const flash = require("express-flash")
const passport = require('passport')

const {getUserByName, getUserById} = require("./auth/getUser.js")
const initializePassport = require("./auth/passport-config")

// Setups the passport
initializePassport(passport, getUserByName, getUserById)

// Main config for the app
app.set("view engine", 'ejs')
app.use(express.static(__dirname + '/../public'));
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: "what this is such a secret key",
    cookie: { maxAge: 60000},
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

const urls = require("../routes/urls.js")
const auth = require("../routes/auth.js")
const profile = require("../routes/profile.js")

app.use("/urls", urls)
app.use("/auth", auth)
app.use("/profile", profile)

console.log("[*] App Well Configurated")

module.exports = app