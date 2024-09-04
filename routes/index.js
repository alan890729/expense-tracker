const express = require('express')

const rootRouter = require('./root')
const recordsRouter = require('./records')

const router = express.Router()

router.use('/', rootRouter)
router.use('/records', recordsRouter)

module.exports = router