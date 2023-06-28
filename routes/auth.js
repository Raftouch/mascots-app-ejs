const { Router } = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

// regsiter handle
router.post(
  '/register',
  [
    check('name', 'Name should have min 2 characters').isLength({ min: 2 }),
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Password should have min 3 and max 12 characters').isLength({ min: 3, max: 12,}),
  ],
  async (req, res) => {
    try {
      const { name, email, password } = req.body
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        res.render('register', {
          name,
          email,
          password,
          errors: errors.array(),
        })
      }

      const candidate = await User.findOne({ email })
      if (candidate) {
        res.status(400).render('register', {
          error_msg: 'Such email is already registered',
        })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ name, email, password: hashedPassword })

      await user.save()

      res.render('login', {
        success_msg: 'You are now registered and can log in',
      })
    } catch (error) {
      res.render('register', {
        error_msg: 'Something went wrong, please try again',
      })
      console.log(error)
    }
  }
)

// login handle
router.post('/login', (req, res, next) =>
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next)
)

// logout handle
router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error)
  })
  res.render('login', {
    success_msg: 'You are logged out',
  })
})

module.exports = router
