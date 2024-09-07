const express = require('express')

const rootRouter = require('./root')
const recordsRouter = require('./records')
const usersRouter = require('./users')
const authHandler = require('../middlewares/auth-handler')

const router = express.Router()

router.use('/', rootRouter)
router.use('/users', usersRouter)
router.use('/records', authHandler, recordsRouter)

module.exports = router