const { Router } = require('express')
const userRouter = Router()
const userController = require('../controllers/auth')
const {
  registerValidation,
  loginValidation,
} = require('../validations/dataCheck')
const errorCheck = require('../validations/errorCheck')

userRouter.get('/login', (req, res) => {
  res.render('login.ejs')
})

userRouter.get('/register', (req, res) => {
  res.render('register.ejs')
})

// /register
userRouter.post(
  '/register',
  registerValidation,
  errorCheck,
  userController.register
)

// /login
userRouter.post(
  '/login', 
  loginValidation, 
  errorCheck, 
  userController.login
)

module.exports = userRouter
