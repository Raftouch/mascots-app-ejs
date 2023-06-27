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

// -->  /register --> authentication
router.post(
  '/register',
  [
    check('name', 'Min length 2 characters').isLength({ min: 2 }),
    check('email', 'Wrong email').isEmail(),
    check('password', 'Min length 3 and max length 12 characters').isLength({
      min: 3,
      max: 12,
    }),
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

      // res.status(201).json({ message: 'User created successfully' })
      res.redirect('/login')
    } catch (error) {
      console.log(error)
      res
        .status(500)
        .json({ message: 'Something went wrong, please try again' })
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
  // req.flash('success_msg', 'You are logged out')
  // res.redirect('/')
  res.redirect('/login')
})


// /login --> authorization
// router.post(
//   '/login',
//   [
//     check('email', 'Please enter valid email').normalizeEmail().isEmail(),
//     check('password', 'Please enter valid password').exists(),
//   ],

//   async (req, res) => {
//     try {
//       const errors = validationResult(req)

//       if (!errors.isEmpty()) {
//         return res.status(400).json({
//           errors: errors.array(),
//           message: 'Wrong credentials',
//         })
//       }

//       const { email, password } = req.body
//       const user = await User.findOne({ email })

//       if (!user) {
//         return res.status(400).json({ message: 'User not found' })
//       }

//       const isMatch = await bcrypt.compare(password, user.password)

//       if (!isMatch) {
//         return res
//           .status(400)
//           .json({ message: 'Wrong password, please try again' })
//       }

//       const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
//         expiresIn: '1h',
//       })

//       // res.json({ token, userId: user.id })
//       console.log(token)
//       res.redirect('dashboard')
//     } catch (error) {
//       res
//         .status(500)
//         .json({ message: 'Something went wrong, please try again' })
//     }
//   }
// )

module.exports = router
