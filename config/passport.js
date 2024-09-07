const passport = require('passport')
const localStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')

const db = require('../models')

const User = db.User

passport.use(new localStrategy({ usernameField: 'email' }, (username, password, done) => {
    return User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: { email: username },
        raw: true
    }).then((user) => {
        if (!user) {
            return done(null, false, { type: 'error', message: '電子郵件或是密碼輸入錯誤' })
        }

        return bcrypt.compare(password, user.password).then((isMatched) => {
            if (!isMatched) {
                return done(null, false, { type: 'error', message: '電子郵件或是密碼輸入錯誤' })
            }

            return done(null, {
                id: user.id,
                name: user.name,
                email: user.email
            })
        })
    }).catch((err) => {
        err.errorMessage = '登入過程發生錯誤'
        return done(err)
    })
}))

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['email', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
    const name = profile._json.name
    const email = profile._json.email

    return User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: { email },
        raw: true
    }).then((user) => {
        if (user) {
            return done(null, {
                id: user.id,
                name: user.name,
                email: user.email
            })
        }

        const password = Math.random().toString(36).slice(-8)
        return bcrypt.hash(password, 10).then((hash) => {
            return User.create({
                name,
                email,
                password: hash
            })
        }).then((user) => {
            return done(null, {
                id: user.id,
                name: user.name,
                email: user.email
            })
        })
    }).catch((err) => {
        err.errorMessage = '登入過程發生錯誤'
        return done(err)
    })
}))

passport.serializeUser((user, done) => {
    return done(null, user)
})

passport.deserializeUser((user, done) => {
    const id = user.id
    return done(null, { id })
})

module.exports = passport