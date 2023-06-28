const { check } = require('express-validator')

const registerValidation = [
  check('name', 'Name should have min 2 characters').isLength({ min: 2 }),
  check('email', 'Please enter valid email').isEmail(),
  check(
    'password',
    'Password should have min 3 and max 12 characters'
  ).isLength({ min: 3, max: 12 }),
]

module.exports = registerValidation
