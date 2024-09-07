module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    req.flash('error', '尚未登入，請登入後再繼續先前操作')
    return res.redirect('/login')
}