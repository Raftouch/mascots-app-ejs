const { Router } = require('express')
const router = Router()
const { register, login, logout } = require('../controllers/auth')
const registerValidation = require('../validations/auth')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', registerValidation, register)

router.post('/login', login)

router.get('/logout', logout)

module.exports = router
