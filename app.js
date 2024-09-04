const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const router = require('./routes')

const app = express()
const port = 3000

app.engine('hbs', engine({ extname: '.hbs' }))
app.set('views', './views')
app.set('view engine', '.hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(router)

app.listen(port, () => {
    console.log(`express server running on http://localhost:${port}`)
})