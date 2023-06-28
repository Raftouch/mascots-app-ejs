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

// register handle
router.post('/register', registerValidation, register)

// login handle
router.post('/login', login)

// logout handle
router.get('/logout', logout)

module.exports = router
