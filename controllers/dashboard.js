const Mascot = require('../models/mascot')

const dashboard = async (req, res) => {
  let mascots
  try {
    mascots = await Mascot.find().sort({ joinedAt: 'desc' }).limit(12).exec()
  } catch (error) {
    mascots = []
  }

  res.render('dashboard/index', {
    mascots: mascots,
    layout: '../views/layouts/main',
  })
}

module.exports = { dashboard }
