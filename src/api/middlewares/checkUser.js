const { validateEmail } = require('../validation/validateEmail')
const { statusCode } = require('../utils/StatusCode')

const dataError = {
	message: 'Invalid entries. Try again.',
	status: statusCode.BAD_REQUEST,
}

const checkUser = (req, res, next) => {
	const user = req.body

	if (!user.name || !user.password || !user.email) {
		return next(dataError)
	}
	const validEmail = validateEmail(user.email)
	if (!validEmail) {
		return next(dataError)
	}
	return next()
}

module.exports = checkUser
