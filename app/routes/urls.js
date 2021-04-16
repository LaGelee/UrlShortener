const express = require("express");
const router = express.Router();
const morgan = require("morgan")

const db = require("../Components/DbHandler.js")

const {getListOfUrls, getStats} = require("../Components/urls/Listofurls.js")
const {generateId, insertUrlToDb} = require("../Components/urls/ShortUrl.js")

const {checkAuthenticated} = require("../Components/auth/checkAuth.js")

router.use(express.static(__dirname + '/../public'));

// Gives the user to the page for urls route
router.use((req,res,next) => {
    res.locals.user = req.user
    next()
})

// Logs
router.use(morgan(':remote-addr - [:date] ":method :url" :status :res[content-length] ":user-agent"'))

// Redirects to the ShortUrl Page
router.get("/", checkAuthenticated, (req,res) => {
    res.render('./pages/urls/shorturl')
})

// This link will add the full and short url with default ckicks to the db with the form from the index page by a POST request
router.post('/shorturl', checkAuthenticated, async (req,res) => {
    try {
        let url_short = await generateId();
        let url_full = req.body.fullURL;
        await insertUrlToDb(url_short, url_full, req.user.user_id)
        console.log(`[*] Adding to database ${url_full} for ${req.user.username}`)
        req.flash("message", 'Successfully adding to database...')
        req.flash('full', url_full)
        req.flash('short', url_short)
        res.redirect("/urls/")
    } catch (err) {
        console.log(err.message)
        req.flash("error", "Error")
        res.redirect("/urls/")
    }
})

//Redirects to the page with the tab of urls
router.get("/listofurls", checkAuthenticated, async (req,res) =>{
    try {
        const user_id = req.user.user_id
        const [url_list, stats] = await Promise.all([getListOfUrls(user_id), getStats(user_id)])
        res.render('./pages/urls/listofurls', {url_list: url_list, stats: stats})
    } catch (error) {
        console.log(error)
        res.render('./pages/urls/listofurls')
    }
})

//Redirects to the full url with the short url and adding 1 click. If not valid short url, raise 404 error
router.get("/:shorturl", (req,res)=>{
    db.get(`SELECT * FROM URL WHERE short = "${req.params.shorturl}"`, (err,data)=>{
        if (err) console.log(err.message)
        if (data == undefined) return res.render(`./pages/404`)
        let clicks = data.clicks + 1;
        db.run(`UPDATE URL SET clicks = ${clicks} WHERE short = "${req.params.shorturl}"`)
        console.log("[*] Someone click on /"+req.params.shorturl+" =====> "+data.full)
        res.redirect(data.full)
    })
})

module.exports = router;