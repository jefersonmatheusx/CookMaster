const { tokenValidator } = require('../validation/tokenValidator')
const { statusCode } = require('../utils/statusCode')
const checkAdminPermission = async (req, res, next) => {
	const token = req.headers['authorization']

	if (!token)
		return next({
			status: statusCode.INVALID_FIELD,
			message: 'missing auth token',
		})

	try {
		const { role } = tokenValidator(token)
		if (role !== 'admin') {
			return next({
				status: statusCode.FORBIDEN,
				message: 'Only admins can register new admins',
			})
		}
		return next()
	} catch (err) {
		return next({ status: statusCode.FORBIDEN, message: err.message })
	}
}

module.exports = checkAdminPermission
