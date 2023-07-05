function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.render('login', {
    error_msg: 'Please login to access the page',
  })
}

module.exports = { ensureAuthenticated }
