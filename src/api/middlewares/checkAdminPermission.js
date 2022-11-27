const { tokenValidator } = require('../validation/tokenValidator')
const { statusCode } = require('../utils/StatusCode')

const error = {
	tokenError: {
		status: statusCode.INVALID_FIELD,
		message: 'missing auth token',
	},
	permissionError: {
		status: statusCode.FORBIDEN,
		message: 'Only admins can register new admins',
	},
}

const checkAdminPermission = async (req, res, next) => {
	const token = req.headers.authorization

	if (!token) {
		return next(error.tokenError)
	}

	try {
		const { role } = tokenValidator(token)
		if (role !== 'admin') {
			return next(error.permissionError)
		}
		return next()
	} catch (err) {
		return next({ status: statusCode.FORBIDEN, message: err.message })
	}
}

module.exports = checkAdminPermission
