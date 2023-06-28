const express = require('express')
const router = express.Router()
const { dashboard } = require('../controllers/dashboard')
const { ensureAuthenticated } = require('../config/auth')

router.get('/dashboard', ensureAuthenticated, dashboard)

module.exports = router
