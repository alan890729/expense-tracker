const express = require('express')

const db = require('../models')
const categoryIcons = require('../jsons/categoryIcons.json').CATEGORY
const pagination = require('../scripts/pagination')

const router = express.Router()
const Record = db.Record
const Category = db.Category

router.get('/', (req, res, next) => {
    const userId = req.user.id
    const categoryName = req.query.category || null
    const currentPage = +req.query.page || 1
    const limit = 10
    const offset = (currentPage - 1) * limit

    function findRecords(userId, categoryId, limit, offset) {
        return Record.count({
            where: categoryId ? { userId, categoryId } : { userId }
        }).then((recordsCount) => {
            pagination.generatePaginatorForRender(res, recordsCount, currentPage)

            return Promise.all([
                Category.findAll({
                    attributes: ['id', 'name'],
                    raw: true
                }),
                Record.findAll({
                    attributes: ['id', 'name', 'date', 'amount'],
                    where: categoryId ? { userId, categoryId } : { userId },
                    include: categoryId ? [] : [
                        {
                            model: Category,
                            attributes: ['name']
                        }
                    ],
                    limit,
                    offset,
                    raw: true
                }),
                Record.sum('amount', {
                    where: categoryId ? { userId, categoryId } : { userId },
                })
            ])
        })
    }

    if (categoryName) {
        return Category.findOne({
            attributes: ['id'],
            where: {
                name: categoryName
            },
            raw: true
        }).then((category) => {
            const categoryId = category.id
            return findRecords(userId, categoryId, limit, offset)
        }).then((data) => {
            let [categories, records, totalAmount] = data

            if (!totalAmount) {
                totalAmount = 0
            }

            categories.forEach(category => {
                if (categoryName === category.name) {
                    category.isSelected = true
                }
            })

            records.forEach(record => {
                record.icon = categoryIcons[categoryName]
            })

            return res.render('index', { categories, records, totalAmount, categoryName })
        }).catch((err) => {
            err.errorMessage = '前往頁面的過程發生了錯誤'
            return next(err)
        })
    } else {
        return findRecords(userId, null, limit, offset).then((data) => {
            let [categories, records, totalAmount] = data

            if (!totalAmount) {
                totalAmount = 0
            }

            records.forEach(record => {
                record.icon = categoryIcons[record['Category.name']]
            })

            return res.render('index', { records, categories, totalAmount })
        }).catch((err) => {
            err.errorMessage = '前往頁面的過程發生了錯誤'
            return next(err)
        })
    }
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
    body.userId = req.user.id

    return Record.create(body).then((result) => {
        req.flash('success', '成功新增一筆支出')
        return res.redirect('/records')
    }).catch((err) => {
        err.errorMessage = '新增一筆支出時發生了錯誤'
        return next(err)
    })
})

router.get('/:id/edit', (req, res, next) => {
    const recordId = +req.params.id
    const userId = req.user.id

    return Promise.all([
        Category.findAll({
            attributes: ['id', 'name'],
            raw: true
        }),
        Record.findByPk(
            recordId,
            {
                attributes: ['id', 'name', 'date', 'amount', 'userId'],
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

        if (!record || record.userId !== userId) {
            req.flash('error', '資料不存在')
            return res.redirect('/records')
        }

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
    const userId = req.user.id
    const body = req.body
    body.categoryId = +body.categoryId
    body.amount = +body.amount

    return Record.findByPk(
        recordId,
        {
            attributes: ['id', 'name', 'date', 'amount', 'categoryId', 'userId']
        }
    ).then((record) => {
        if (!record || record.userId !== userId) {
            req.flash('error', '資料不存在')
            return res.redirect('/records')
        }

        return record.update(
            body,
            {
                where: { id: recordId }
            }
        )
    }).then((result) => {
        req.flash('success', '成功修改了一筆支出')
        return res.redirect('/records')
    }).catch((err) => {
        err.errorMessage = '修改一筆支出時發生了錯誤'
        return next(err)
    })
})

router.get('/:id/delete-confirm', (req, res, next) => {
    const recordId = +req.params.id
    const userId = req.user.id

    return Record.findByPk(
        recordId,
        {
            attributes: ['id', 'name', 'date', 'amount', 'userId'],
            include: [
                {
                    model: Category,
                    attributes: ['name']
                }
            ],
            raw: true
        }
    ).then((record) => {
        if (!record || record.userId !== userId) {
            req.flash('error', '資料不存在')
            return res.redirect('/records')
        }

        record.icon = categoryIcons[record['Category.name']]
        return res.render('delete-confirm', { record })
    }).catch((err) => {
        err.errorMessage = '前往頁面的過程發生了錯誤'
        return next(err)
    })
})

router.delete('/:id', (req, res, next) => {
    const recordId = +req.params.id
    const userId = req.user.id

    return Record.findByPk(
        recordId,
        {
            attributes: ['id', 'userId']
        }
    ).then((record) => {
        if (!record || record.userId !== userId) {
            req.flash('error', '資料不存在')
            return res.redirect('/records')
        }

        return record.destroy()
    }).then((result) => {
        req.flash('success', '成功刪除了一筆支出')
        return res.redirect('/records')
    }).catch((err) => {
        err.errorMessage = '刪除一筆支出時發生了錯誤'
        return next(err)
    })
})

module.exports = router