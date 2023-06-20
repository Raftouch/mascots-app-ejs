const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const expressLayouts = require('express-ejs-layouts')
const port = process.env.PORT || 4000

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false }))

app.use('/', require('./routes/index'))
app.use('/collaborators', require('./routes/collaborator'))

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(port, () => console.log(`App is running on port ${port}`))
    console.log('Connected to DB')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
