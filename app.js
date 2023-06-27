const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const port = process.env.PORT || 4000

const session = require('express-session')
const passport = require('passport')
// passport config
require('./config/passport')(passport)

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false }))

// express session middleware
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
)

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect flash middleware
app.use(flash())

// global variables (customized by us)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use('/', require('./routes/index'))
app.use('/collaborators', require('./routes/collaborator'))
app.use('/mascots', require('./routes/mascots'))
app.use('/', require('./routes/auth'))
app.use('/', require('./routes/dashboard'))

app.get('*', (req, res) => {
  res.status(404).render('404')
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
