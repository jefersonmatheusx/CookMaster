const jwt = require('jsonwebToken')
const secret = require('../utils/secret')
const tokenValidator = (token) => {
  try {
    let dataToken
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        throw new Error({ message: 'jwt malformed' })
      } else {
        dataToken = decodedToken
      }
    })
    return dataToken
  } catch (err) {
    throw new Error({ msg: 'Invalid Token' })
  }
}

module.exports = {
  tokenValidator
}
