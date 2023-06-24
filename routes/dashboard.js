const express = require('express')
const router = express.Router()
const controller = require('../controllers/dashboard')
const isAuth = require('../middleware/auth')

router.get('/dashboard', isAuth, controller.dashboard)

module.exports = router
