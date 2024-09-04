const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const db = require('./models')
const categoryIcons = require('./jsons/categoryIcons.json').CATEGORY

const app = express()
const port = 3000
const Record = db.Record
const Category = db.Category

app.engine('hbs', engine({ extname: '.hbs' }))
app.set('views', './views')
app.set('view engine', '.hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    return res.render('root')
})

app.get('/records', (req, res) => {
    return Promise.all([
        Category.findAll({
            attributes: ['id', 'name'],
            raw: true
        }),
        Record.findAll({
            attributes: ['id', 'name', 'date', 'amount'],
            include: [
                {
                    model: Category,
                    attributes: ['name']
                }
            ],
            raw: true
        })
    ]).then((data) => {
        const [categories, records] = data
        records.forEach(record => {
            record.icon = categoryIcons[record['Category.name']]
        })
        const totalAmount = records
            .map((record) => record.amount)
            .reduce((prev, current) => prev + current)

        return res.render('index', { records, categories, totalAmount })
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

app.get('/records/new', (req, res) => {
    return Category.findAll({
        attributes: ['id', 'name'],
        raw: true
    }).then((categories) => {
        return res.render('new', { categories })
    })
})

app.post('/records', (req, res) => {
    const body = req.body
    body.categoryId = +body.categoryId
    body.amount = +body.amount

    return Record.create(body).then((result) => {
        return res.redirect('/records')
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

app.get('/records/filtered-by/:category', (req, res) => {
    const categoryName = req.params.category

    return Category.findOne({
        attributes: ['id'],
        where: {
            name: categoryName
        },
        raw: true
    }).then((category) => {
        const categoryId = category.id

        return Promise.all([
            Category.findAll({
                attributes: ['id', 'name'],
                raw: true
            }),
            Record.findAll({
                attributes: ['id', 'name', 'date', 'amount'],
                where: { categoryId },
                raw: true
            })
        ])
    }).then((data) => {
        const [categories, records] = data
        const totalAmount = records
            .map(record => record.amount)
            .reduce((prev, current) => prev + current)

        categories.forEach(category => {
            if (categoryName === category.name) {
                category.isSelected = true
            }
        })

        records.forEach(record => {
            record.icon = categoryIcons[categoryName]
        })

        return res.render('filtered-records', { categories, records, totalAmount })
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

app.get('/records/:id/edit', (req, res) => {
    const recordId = +req.params.id

    return Promise.all([
        Category.findAll({
            attributes: ['id', 'name'],
            raw: true
        }),
        Record.findByPk(
            recordId,
            {
                attributes: ['id', 'name', 'date', 'amount'],
                include: [
                    {
                        model: Category,
                        attributes: ['name']
                    }
                ],
                raw: true
            }
        )
    ]).then((data) => {
        const [categories, record] = data
        categories.forEach(category => {
            if (category.name === record['Category.name']) {
                category.prevSelectedCategory = true
            }
        })

        return res.render('edit', { record, categories })
    }).catch((err) => {
        return res.status(422).json(err)
    })
})

app.put('/records/:id', (req, res) => {
    const recordId = +req.params.id
    const body = req.body
    body.categoryId = +body.categoryId
    body.amount = +body.amount

    return Record.update(
        body,
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
            include: [
                {
                    model: Category,
                    attributes: ['name']
                }
            ],
            raw: true
        }
    ).then((record) => {
        record.icon = categoryIcons[record['Category.name']]
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