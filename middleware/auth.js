const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  // if (req.method === 'OPTIONS') {
  //   return next()
  // }
  const token =
    req.body.token || req.query.token || req.headers['x-access-token']

  if (!token)
    return res
      .status(403)
      .send({ message: 'A token is required for authentication' })

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Authorization failed' })
    console.log(error)
  }
}

module.exports = verifyToken
