const express = require('express')

const passport = require('../config/passport')

const router = express.Router()

router.get('/', (req, res) => {
    return res.render('root')
})

router.get('/login', (req, res) => {
    return res.render('login')
})

router.get('/register', (req, res) => {
    return res.render('register')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/records',
    failureRedirect: '/login',
    failureFlash: true
}))

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }

        req.flash('success', '登出成功')
        return res.redirect('/login')
    })
})

module.exports = router