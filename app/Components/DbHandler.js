const fs = require("fs");
const sqlite3 = require('sqlite3').verbose()

let db;

// Const for the creation of the USERS Table
const USERS = "CREATE TABLE USERS ( \
    user_id INTEGER PRIMARY KEY AUTOINCREMENT, \
    username TEXT UNIQUE NOT NULL, \
    password TEXT NOT NULL, \
    email TEXT UNIQUE NOT NULL, \
    name TEXT NOT NULL, \
    lastname TEXT NOT NULL, \
    create_date TEXT NOT NULL, \
    description TEXT, \
    hobbies TEXT)"

// Const for the creation of the URL Table
const URL = "CREATE TABLE URL ( \
    full TEXT NOT NULL, \
    short TEXT PRIMARY KEY, \
    clicks INT, \
    user_id INT, \
    CONSTRAINT fk_USERS FOREIGN KEY (user_id) REFERENCES USERS(user_id))"

// Returns a SQLITE object depending of the path
const connectDb = (path) => {
    console.log(`[*] DB Connecting to ${path}`)
    return new sqlite3.Database(path, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {console.log(err.message)}
        else {console.log(`[*] DB Connected to ${path}`)}
    })
}

// Initializes the URL table
const initializeURL = () => {
    return new Promise((resolve, reject) => {
        db.run(URL, (err, data) => {
            if (err) {
                reject(err.message)
            } else {
                console.log("[*] Tab URL was created")
                resolve()
            }
        })
    })
}

// Initializes the Users table
const initializeUsers = () => {
    return new Promise((resolve, reject) => {
        db.run(USERS, (err, data) => {
            if (err) {
                reject(err.message)
            } else {
                console.log("[*] Tab USERS was created")
                resolve()
            }
        })
    })
}

// Setups all the DB connection and the tables
const checkDbExist = async (path) => {
    if (fs.existsSync(path)) {
        console.log(`[*] DB ${path} alredy exist`)
        db = connectDb(path)
    } else {
        console.log(`[*] DB ${path} does not exist`)
        fs.closeSync(fs.openSync(path, 'w'))
        console.log(`[*] DB ${path} was created`)
        db = connectDb(path)
        await initializeUsers()
        await initializeURL()
        console.log(`[*] DB ${path} is initialize`)
    }
}

checkDbExist("./models/content.db")
module.exports = db