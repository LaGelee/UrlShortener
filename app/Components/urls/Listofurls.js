const db = require("../DbHandler.js")

// Returns a Promise which gets all the urls in the db
function getListOfUrls(user_id) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT full, short, clicks FROM URL WHERE user_id = ${user_id}`, (err, url_list) => {
            if (err) {
                reject(err.message)
            } else {
                resolve(url_list)
            }
        })
    })
}

// Returns a Promise which counts the number of urls in the db
function getStats(user_id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(*) AS NBR, ROUND(AVG(clicks),2) AS CLICKS FROM URL WHERE user_id = ${user_id}`, (err, links_nbr) => {
            if (err) {reject(err.message)}
            else {resolve(links_nbr)}
        })
    })
}

module.exports = {getListOfUrls, getStats}