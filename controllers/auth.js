const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const passport = require('passport')

const register = async (req, res) => {
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

const login = (req, res, next) =>
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next)

const logout = (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error)
  })
  res.render('login', {
    success_msg: 'You are logged out',
  })
}

module.exports = { register, login, logout }
