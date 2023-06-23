const express = require('express')
const router = express.Router()
// const Mascot = require('../models/mascot')

router.get('/', async (req, res) => {
  // let mascots
  // try {
  //   mascots = await Mascot.find().sort({ joinedAt: 'desc' }).limit(10).exec()
  // } catch (error) {
  //   mascots = []
  // }
  // res.render('index', { mascots: mascots })
  res.render('index')
})

module.exports = router
