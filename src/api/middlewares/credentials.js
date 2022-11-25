const StatusCode = require('../utils/StatusCode')
const { tokenValidator } = require('../validation/tokenValidator')
module.exports = (req, res, next) => {
	const token = req.headers['authorization']

	if (!token)
		next({
			status: StatusCode.INVALID_FIELD,
			message: 'missing auth token',
		})

	try {
		const decodedToken = tokenValidator(token)
		req.userId = decodedToken._id
		req.userRole = decodedToken.role
		next()
	} catch (error) {
		next({ message: 'jwt malformed', status: StatusCode.INVALID_FIELD })
	}
}
