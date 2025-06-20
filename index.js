const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const app = express()
const port = process.env.PORT || 4000

require('./config/passport')(passport)

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false }))

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.year = new Date().getFullYear()
  next()
})

app.use('/collaborators', require('./routes/collaborators'))
app.use('/mascots', require('./routes/mascots'))
app.use('/', require('./routes/auth'))
app.use('/', require('./routes/dashboard'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('*', (req, res) => {
  res.render('404')
})

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
