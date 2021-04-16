const db = require("../DbHandler.js")
const bcrypt = require('bcrypt')

// Checks if the two passwords match
function checkPassword(password, repeatpassword) {
    const check = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return new Promise((resolve, reject) => {
        if (password !== repeatpassword ) {
            reject("Passwords don't match")
        } else if (!check.test(password)) {
            reject("Password must contains at least 1 special character, 1 digit, 1 lowercase, 1 uppercase and must be 8 characters or longer")
        } else {
            resolve()
        }
    })
}

// Checks if the username don't exist
function checkUsername(username) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM USERS WHERE username = "${username}"`, (err, data) => {
            if (err) {
                console.log(err)
                reject("Problem with the DB while checking Username")
            } else if (data) {
                reject("Username already exists !")
            } else {
                resolve()
            }
        })
    })
}

// Checks if the username don't exist
function checkEmail(email) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM USERS WHERE email = "${email}"`, (err, data) => {
            if (err) {
                console.log(err)
                reject("Problem with the DB while checking Email")
            } else if (data) {
                reject("Email already exists !")
            } else {
                resolve()
            }
        })
    })
}

// Returns the current date
function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = mm + '/' + dd + '/' + yyyy;
    return today
}

// Formats the insert user querry
function betterInsertUser(user) {
    const champs = "username, password, email, name, lastname, create_date, description, hobbies"
    const values = `"${user.username}", "${user.password}", "${user.email}", "${user.name}", "${user.lastname}", "${getDate()}", "...", "..."`
    return `INSERT INTO USERS (${champs}) VALUES (${values})`
}

// Inserts the user in the db
function insertUserToDb(user) {
    return new Promise((resolve, reject) => {
        db.run(betterInsertUser(user), (err,data) => {
            if (err) {
                console.log(err)
                reject("Problem with the DB while adding the user")
            } else {
                console.log(`[*] DB user ${user.username} was successfully added`)
                resolve(`Your account has been created`)
            }
        })
    })
}

// Main function to make all the checks and register the user
function registerUser(user) {
    return new Promise(async (resolve, reject) => {
        try {
            const {username, email, password, repeatpassword} = user;
            await checkUsername(username)
            await checkPassword(password, repeatpassword)
            await checkEmail(email)
            user.password = await bcrypt.hash(password, 10)
            resolve(insertUserToDb(user))
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {registerUser}