const express = require('express')
const router = express.Router()
const controller = require('../controllers/dashboard')
const { ensureAuthenticated } = require('../config/auth')

router.get('/dashboard', ensureAuthenticated, controller.dashboard)

module.exports = router
