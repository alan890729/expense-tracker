const express = require('express')
const bcrypt = require('bcryptjs')

const db = require('../models')

const router = express.Router()
const User = db.User

router.post('/', (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body

    const hasEmptyInput = Object.keys(req.body).some(key => {
        if (!req.body[key]) {
            return key
        }
    })
    if (hasEmptyInput) {
        req.flash('error', `'*'標記的欄位為必填，請再次嘗試`)
        return res.redirect('/register')
    }

    if (password !== confirmPassword) {
        req.flash('error', '密碼與確認密碼不符')
        return res.redirect('/register')
    }

    return User.findOne({
        where: { email },
        raw: true
    }).then((user) => {
        if (user) {
            req.flash('error', '已經有帳號，可以前往登入')
            return res.redirect('/register')
        }

        return bcrypt.hash(password, 10).then((hash) => {
            return User.create({
                name,
                email,
                password: hash
            })
        }).then((user) => {
            req.flash('success', '成功註冊，可以進行登入')
            return res.redirect('/login')
        })
    }).catch((err) => {
        err.errorMessage = '註冊使用者失敗'
        return next(err)
    })
})

module.exports = router