const loginService = require('../services/LoginService')
const { statusCode } = require('../utils/statusCode')

const userLogin = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		return res.status(statusCode.INVALID_FIELD).json({ message: 'All fields must be filled' })
	}

	try {
		const token = await loginService.login({
			email,
			password,
		})
		return res.status(statusCode.OK).json({ token })
	} catch (err) {
		return res.status(statusCode.INVALID_FIELD).json({ message: err.message })
	}
}

module.exports = {
	userLogin,
}
