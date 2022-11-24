const jwt = require('jsonwebToken')
const secret = require('../utils/secret')
const tokenValidator = (token) => {
  try {
    let dataToken
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        throw new Error('jwt malformed')
      } else {
        dataToken = decodedToken
      }
    })
    return dataToken
  } catch (err) {
    throw new Error('Invalid Token')
  }
}

module.exports = {
  tokenValidator
}
