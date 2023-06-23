const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/user')
const router = Router()

// -->  /register --> authentication
router.get('/register', (req, res) => {
  res.render('register')
})

router.post(
  '/register',
  [
    check('name', 'Min length 2 characters').isLength({ min: 2 }),
    check('email', 'Wrong email').isEmail(),
    check('password', 'Min length 6 characters').isLength({ min: 6 }),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Wrong credentials',
        })
      }

      const { name, email, password } = req.body
      const candidate = await User.findOne({ email })

      if (candidate) {
        return res.status(400).json({ message: 'Such user already exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ name, email, password: hashedPassword })

      await user.save()

    //   res.status(201).json({ message: 'User created successfully' })
      return res.redirect('login')
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Something went wrong, please try again' })
    }
  }
)

// -->  /login --> authorization
router.get('/login', (req, res) => {
  res.render('login')
})

router.post(
  '/login',
  [
    check('email', 'Please enter valid email').normalizeEmail().isEmail(),
    check('password', 'Please enter valid password').exists(),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Wrong credentials',
        })
      }

      const { email, password } = req.body
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'Wrong password, pleasetry again' })
      }

      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      })

    //   res.json({ token, userId: user.id })
      res.redirect('dashboard')
      console.log(error);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Something went wrong, please try again' })
    }
  }
)

module.exports = router
