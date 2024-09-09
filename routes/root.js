const express = require('express')

const passport = require('../config/passport')
const unsplash = require('../config/unsplash')

const router = express.Router()

router.get('/', (req, res) => {
    return res.render('root')
})

router.get('/login', (req, res, next) => {
    unsplash.photos.get({ photoId: 'maJDOJSmMoo' }).then((result) => {
        if (result.errors) {
            console.error(result.errors[0])
        } else {
            const photo = result.response
            return res.render('login', { backgroundImg: photo.urls.regular })
        }
    }).catch((err) => {
        err.errorMessage = '登入頁背景圖片取得過程出錯'
        return next(err)
    })
})

router.get('/register', (req, res) => {
    unsplash.photos.get({ photoId: 'maJDOJSmMoo' }).then((result) => {
        if (result.errors) {
            console.error(result.errors[0])
        } else {
            const photo = result.response
            return res.render('register', { backgroundImg: photo.urls.regular })
        }
    }).catch((err) => {
        err.errorMessage = '登入頁背景圖片取得過程出錯'
        return next(err)
    })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/records',
    failureRedirect: '/login',
    failureFlash: true
}))

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            err.errorMessage = '登出失敗'
            return next(err)
        }

        req.flash('success', '登出成功')
        return res.redirect('/login')
    })
})

module.exports = router