const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // checking if there is already user with such email
    const candidate = await User.findOne({ email })

    // if there is already one like this
    if (candidate) {
      return res.status(400).json({ message: 'Such user already exists' })
    }

    // if there is no, we can register him (hash password)
    const hashedPassword = await bcrypt.hash(password, 10)

    // when all checked, create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })

    await user.save()
    // res.status(201).json({ message: 'User created successfully' })
    res.redirect('/login')
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Registration failed' })
    // res.redirect('/register')
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Wrong password, please try again' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    })
    console.log(user, token)
    // res.status(200).json({ message: "Login successful", user, token })
    // localStorage.setItem('info', JSON.stringify({'user': token}));
    res.redirect('/dashboard')
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Login failed' })
    // res.redirect('/login')
  }
}

module.exports = { register, login }
