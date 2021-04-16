const shortid = require("shortid")
const db = require("../DbHandler.js")


// Checks if the id already exists in the db
function checkId(id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM URL WHERE short = "${id}"`, (err, data) => {
            if (!data) {
                resolve(id)
            } else {
                reject("[*] Id already exists")
            }
        }) 
    })
}

// Generates a random ID 
function generateId() {
    let check;
    let id = shortid.generate();
    return new Promise(async (resolve, reject) => {
        do {
            try {
                await checkId(id)
                check = "ok"
            } catch (error) {
                console.log(error)
                id = shortid.generate()
            }
        } while(!check)
        resolve(id)
    })
}

// Function to insert the url in the db 
function insertUrlToDb(shorturl, fullurl, user_id) {
    return new Promise ((resolve, reject) => {
        db.run(`INSERT into URL(full,short,clicks, user_id)values("${fullurl}","${shorturl}",0, ${user_id})`, (err, data) => {
            if (err) {reject(err.message)}
            else {resolve()}
        })
    })
}

module.exports = {generateId, insertUrlToDb}