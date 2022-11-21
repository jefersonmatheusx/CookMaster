const secret = require('./secret')
const jwt = require('jsonwebToken')

module.exports = ({ _id, email, role }) => {
  const token = jwt.sign(
    {
      _id,
      email,
      role
    },
    secret,
    {
      expiresIn: 129600
    }
  )
  return token
}
