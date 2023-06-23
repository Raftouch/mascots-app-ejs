const Mascot = require('../models/mascot')

const dashboard = async (req, res) => {
  let mascots
  try {
    mascots = await Mascot.find().sort({ joinedAt: 'desc' }).limit(10).exec()
  } catch (error) {
    mascots = []
  }
  res.render('dashboard/dashboard', {
    mascots: mascots,
    layout: '../views/layouts/dashboard',
  })
}

module.exports = { dashboard }
