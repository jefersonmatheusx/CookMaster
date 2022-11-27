const { validateEmail } = require('../validation/validateEmail')
const { statusCode } = require('../utils/statusCode')

const checkUser = (req, res, next) => {
	const user = req.body
	const validEmail = validateEmail(user.email)

	if (!user || !user.name || !user.password || !user.email || !validEmail) {
		return next({
			message: 'Invalid entries. Try again.',
			status: statusCode.BAD_REQUEST,
		})
	}

	return next()
}

module.exports = checkUser
