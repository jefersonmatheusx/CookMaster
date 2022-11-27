const { statusCode } = require('../utils/StatusCode')
const { tokenValidator } = require('../validation/tokenValidator')

module.exports = (req, res, next) => {
	const token = req.headers.authorization

	if (!token) {
		return next({
			status: statusCode.INVALID_FIELD,
			message: 'missing auth token',
		})
	}
	try {
		const decodedToken = tokenValidator(token)
		req.userId = decodedToken._id
		req.userRole = decodedToken.role
		next()
	} catch (error) {
		return next({ message: 'jwt malformed', status: statusCode.INVALID_FIELD })
	}
}
