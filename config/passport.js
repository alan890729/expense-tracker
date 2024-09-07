const passport = require('passport')
const localStrategy = require('passport-local')
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

passport.serializeUser((user, done) => {
    return done(null, user)
})

passport.deserializeUser((user, done) => {
    const id = user.id
    return done(null, { id })
})

module.exports = passport