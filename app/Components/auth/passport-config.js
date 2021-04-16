const LocalStrategy = require("passport-local").Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByName, getUserById) {

    // Authenticates the user or not
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByName(username)
        if (!user) {
            return done(null, false, {message: "No user was found..."})
        } else if (! await bcrypt.compare(password, user.password)) {
            return done(null, false, {message: "Password invalid !"})
        } else {
            console.log(`[*] ${user.username} just logged in`)
            return done(null, user, {message: 'You just logged in'})
        } 

    }

    // Main config for the Passport
    passport.use(new LocalStrategy({usernameField: "username", passwordField: "password"}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.user_id))
    passport.deserializeUser(async (user_id, done) => {
        return done(null, await getUserById(user_id))
    })
}

module.exports = initialize