const { validateEmail } = require('../validation/validateEmail')
const { statusCode } = require('../utils/statusCode')
module.exports = (req, res, next) => {
	const { email } = req.body
	const validEmail = validateEmail(email)
	if (!validEmail) {
		return next({
			status: statusCode.BAD_REQUEST,
			message: 'Invalid entries. Try again',
		})
	}
}
