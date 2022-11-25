const { tokenValidator } = require('../validation/tokenValidator')
const StatusCode = require('../utils/StatusCode')
const checkAdminPermission = async (req, res, next) => {
	const token = req.headers['authorization']

	if (!token)
		return next({
			status: StatusCode.INVALID_FIELD,
			message: 'missing auth token',
		})

	try {
		const { role } = tokenValidator(token)
		if (role !== 'admin') {
			return next({
				status: StatusCode.FORBIDEN,
				message: 'Only admins can register new admins',
			})
		}
		return next()
	} catch (err) {
		return next({ status: StatusCode.FORBIDEN, message: err.message })
	}
}

module.exports = checkAdminPermission
