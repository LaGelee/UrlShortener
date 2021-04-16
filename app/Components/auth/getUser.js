const db = require("../DbHandler.js")

// Returns if a user if he exists by his username
const getUserByName = (username) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM USERS WHERE username = "${username}"`, (err, user) => {
            if (err) {console.log(err)}
            if (user) {resolve(user)}
            else {resolve()}
        })
    })
}

// Returns if a user if he exists by his id
const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM USERS WHERE user_id = ${id}`, (err, user) => {
            if (err) {console.log(err)}
            if (user) {resolve(user)}
            else {resolve()}
        })
    })
}

module.exports = {getUserByName, getUserById}