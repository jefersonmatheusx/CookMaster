const jwt = require('jsonwebtoken')
const secret = require('./secret')

module.exports = ({ _id, email, role }) => {
	const token = jwt.sign(
		{
			_id,
			email,
			role,
		},
		secret,
		{
			expiresIn: 129600,
		},
	)
	return token
}
