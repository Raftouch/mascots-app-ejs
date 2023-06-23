const { validationResult } = require('express-validator')

const errorCheck = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      message: 'Please check entered data',
    })
  }
  next()
}

module.exports = errorCheck
