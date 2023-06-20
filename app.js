const express = require('express')
const app = express()
const expressLayouts = require("express-ejs-layouts")
const port = process.env.PORT || 4000

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

app.use('/', require('./routes/index'))

app.listen(port, () => console.log(`App listening on port ${port}`))