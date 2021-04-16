const app = require("./Components/ConfigApp.js")
const morgan = require("morgan")

// Gives the user to the page for main route
app.use((req,res,next) => {
    res.locals.user = req.user
    next()
})

// Logs
app.use(morgan(':remote-addr - [:date] ":method :url" :status :res[content-length] ":user-agent"'))

// Redirects to the home page
app.get("/", (req,res) => {
    res.render("./pages/home")
})


// Handles all bad page for main route
app.get("*", (req,res) => {
    res.status(404).render(`./pages/404`)
})

// Chooses the port and start the server
const port = 80;
app.listen(port, () => {
    console.log("[*] Server started on port "+port)
})
