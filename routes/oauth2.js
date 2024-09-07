const express = require('express')

const passport = require('../config/passport')

const router = express.Router()

router.get('/login/facebook', passport.authenticate('facebook', {
    scope: ['email']
}))

router.get('/redirect/facebook', passport.authenticate('facebook', {
    successRedirect: '/records',
    failureRedirect: '/login',
    failureFlash: true
}))

module.exports = router