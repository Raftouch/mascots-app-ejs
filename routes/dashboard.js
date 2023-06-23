const express = require('express')
const dashboardRouter = express.Router()
const dashboardController = require('../controllers/dashboard')

dashboardRouter.get('/dashboard', dashboardController.dashboard)

module.exports = dashboardRouter
