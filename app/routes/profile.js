const express = require("express");
const router = express.Router();
const morgan = require("morgan")

const {checkAuthenticated} = require("../Components/auth/checkAuth.js")
const {getStats} = require("../Components/urls/Listofurls")

router.use(express.static(__dirname + '/../public'));

// Logs
router.use(morgan(':remote-addr - [:date] ":method :url" :status :res[content-length] ":user-agent"'))

// Redirects to the ShortUrl Page
router.get("/", checkAuthenticated, async (req,res) => {
    res.locals.user = req.user
    const stats = await getStats(req.user.user_id)
    if (!stats.CLICKS) {stats.CLICKS = 0}
    res.render('./pages/profile/profile', {stats: stats})
})

module.exports = router;