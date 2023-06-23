const { check } = require('express-validator')

const registerValidation = [
  check('name', 'Please enter valid name').isLength({ min: 2 }),
  check('email', 'Wrong email').isEmail(),
  check(
    'password',
    'Min length 4 characters, Max length 12 characters'
  ).isLength({ min: 4, max: 12 }),
]

const loginValidation = [
  check('email', 'Wrong email').normalizeEmail().isEmail(),
  check('password', 'Min length 6 characters').exists(),
]

module.exports = { registerValidation, loginValidation }
