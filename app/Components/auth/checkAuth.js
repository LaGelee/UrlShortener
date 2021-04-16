// Handles if the uer is log in and redirect
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash("error", "Please log in to access the page")
    res.redirect("/")
  }

// Handles if the uer is log out and redirect
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    req.flash("error", "Please log out to access the page")
    return res.redirect("/")
  }
  next()
}

module.exports = {checkAuthenticated, checkNotAuthenticated}