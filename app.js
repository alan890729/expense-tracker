const express = require('express')

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('on route: GET /')
})

app.get('/records', (req, res) => {
    res.send('on route: GET /records, show all records')
})

app.get('/records/new', (req, res) => {
    res.send('on route: GET /records/new, a page that can enter a expense record')
})

app.post('/records', (req, res) => {
    res.send('on route: POST /records, add a new record to database')
})

app.get('/records/filtered-by/:category', (req, res) => {
    const categoryName = req.params.category
    res.send(`on route: /records/filtered-by/${categoryName}, show all records which matched the selected category`)
})

app.get('/records/:id/edit', (req, res) => {
    const recordId = req.params.id
    res.send(`on route: GET /records/${recordId}/edit, can edit record here`)
})

app.put('/records/:id', (req, res) => {
    const recordId = req.params.id
    res.send(`on route: PUT /records/${recordId}, update a record`)
})

app.get('/records/:id/delete-confirm', (req, res) => {
    const recordId = req.params.id
    res.send(`on route: GET /records/${recordId}/delete-confirm, a page that making sure user wants to delete a record`)
})

app.delete('/records/:id', (req, res) => {
    const recordId = req.params.id
    res.send(`on route: DELETE /records/${recordId}, delete a record`)
})

app.listen(port, () => {
    console.log(`express server running on http://localhost:${port}`)
})