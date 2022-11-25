const jwt = require('jsonwebToken')
const secret = require('../utils/secret')
const tokenValidator = (token) => {
	let dataToken
	jwt.verify(token, secret, (err, decodedToken) => {
		if (err) {
			throw new Error('jwt malformed')
		} else {
			dataToken = decodedToken
		}
	})
	return dataToken
}

module.exports = {
	tokenValidator,
}
