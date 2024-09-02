const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const db = require('./models')

const app = express()
const port = 3000
const Record = db.Record

app.engine('hbs', engine({ extname: '.hbs' }))
app.set('views', './views')
app.set('view engine', '.hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    return res.render('root')
})

app.get('/records', (req, res) => {
    return Record.findAll({
        attributes: ['id', 'name', 'date', 'amount'],
        raw: true
    }).then((records) => {
        const totalAmount = records
            .map((record) => record.amount)
            .reduce((prev, current) => prev + current)

        return res.render('index', { records, totalAmount })
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

app.get('/records/new', (req, res) => {
    return res.render('new')
})

app.post('/records', (req, res) => {
    return Record.create(req.body).then((result) => {
        return res.redirect('/records')
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

app.get('/records/filtered-by/:category', (req, res) => {
    // 做到category就會用到這個endpoint
    const categoryName = req.params.category
    res.send(`on route: /records/filtered-by/${categoryName}, show all records which matched the selected category`)
})

app.get('/records/:id/edit', (req, res) => {
    const recordId = +req.params.id

    return Record.findByPk(
        recordId,
        {
            attributes: ['id', 'name', 'date', 'amount'],
            raw: true
        }
    ).then((record) => {
        return res.render('edit', { record })
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

app.put('/records/:id', (req, res) => {
    const recordId = +req.params.id

    return Record.update(
        req.body,
        {
            where: { id: recordId }
        }
    ).then((result) => {
        return res.redirect('/records')
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

app.get('/records/:id/delete-confirm', (req, res) => {
    const recordId = +req.params.id

    return Record.findByPk(
        recordId,
        {
            attributes: ['id', 'name', 'date', 'amount'],
            raw: true
        }
    ).then((record) => {
        return res.render('delete-confirm', { record })
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

app.delete('/records/:id', (req, res) => {
    const recordId = +req.params.id

    return Record.destroy({
        where: { id: recordId }
    }).then((result) => {
        return res.redirect('/records')
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

app.listen(port, () => {
    console.log(`express server running on http://localhost:${port}`)
})