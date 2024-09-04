const express = require('express')

const db = require('../models')
const categoryIcons = require('../jsons/categoryIcons.json').CATEGORY

const router = express.Router()
const Record = db.Record
const Category = db.Category

router.get('/', (req, res, next) => {
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
        err.errorMessage = '前往頁面的過程發生了錯誤'
        return next(err)
    })
})

router.get('/new', (req, res, next) => {
    return Category.findAll({
        attributes: ['id', 'name'],
        raw: true
    }).then((categories) => {
        return res.render('new', { categories })
    }).catch((err) => {
        err.errorMessage = '前往頁面的過程發生了錯誤'
        return next(err)
    })
})

router.post('/', (req, res, next) => {
    const body = req.body
    body.categoryId = +body.categoryId
    body.amount = +body.amount

    return Record.create(body).then((result) => {
        req.flash('success', '成功新增一筆支出')
        return res.redirect('/records')
    }).catch((err) => {
        err.errorMessage = '新增一筆支出時發生了錯誤'
        return next(err)
    })
})

router.get('/filtered-by/:category', (req, res, next) => {
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
        err.errorMessage = '前往頁面的過程發生了錯誤'
        return next(err)
    })
})

router.get('/:id/edit', (req, res, next) => {
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
        err.errorMessage = '前往頁面的過程發生了錯誤'
        return next(err)
    })
})

router.put('/:id', (req, res, next) => {
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
        req.flash('success', '成功修改了一筆支出')
        return res.redirect('/records')
    }).catch((err) => {
        err.errorMessage = '修改一筆支出時發生了錯誤'
        return next(err)
    })
})

router.get('/:id/delete-confirm', (req, res, next) => {
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
        err.errorMessage = '前往頁面的過程發生了錯誤'
        return next(err)
    })
})

router.delete('/:id', (req, res, next) => {
    const recordId = +req.params.id

    return Record.destroy({
        where: { id: recordId }
    }).then((result) => {
        req.flash('success', '成功刪除了一筆支出')
        return res.redirect('/records')
    }).catch((err) => {
        err.errorMessage = '刪除一筆支出時發生了錯誤'
        return next(err)
    })
})

module.exports = router