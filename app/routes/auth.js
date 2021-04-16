const express = require("express");
const passport = require("passport");
const router = express.Router();
const morgan = require("morgan")

const {checkAuthenticated, checkNotAuthenticated} = require("../Components/auth/checkAuth.js")
const {registerUser} = require("../Components/auth/registerUser.js")

router.use(express.static(__dirname + '/../public'));

// Logs
router.use(morgan(':remote-addr - [:date] ":method :url" :status :res[content-length] ":user-agent"'))

// Redirects to the login page
router.get("/login", checkNotAuthenticated, (req,res) => {
    res.render(`./pages/auth/login`)
})

// Handles the authentification of the user
router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: "/auth/login",
    failureFlash: true,
    successFlash: true
}))

// Redirects to the register page
router.get("/register", checkNotAuthenticated, (req,res) => {
    res.render(`./pages/auth/register`)
})

// Handles the registering of the user
router.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
        const check = await registerUser(req.body)
        req.flash("success", check)
        res.redirect("/")
    } catch (err) {
        req.flash("error", err)
        res.redirect("/auth/register")
    }
    
})

// Logs out the user
router.get("/logout", checkAuthenticated, (req,res) => {
    console.log(`[*] ${req.user.username} just logged out`)
    req.logOut()
    req.flash("success", "You just logged out")
    res.redirect(`/`)
})

// Handles bad page redirect
router.get("*", (req,res) => {
    res.status(404).render(`./pages/404`)
})

module.exports = router;