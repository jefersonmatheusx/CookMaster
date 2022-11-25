const usersModel = require('../models/UsersModel')
const { validateEmail } = require('../validation/validateEmail')
const generateToken = require('../utils/GenerateToken')

const login = async (user) => {
	const validEmail = validateEmail(user.email)
	if (!validEmail) {
		throw new Error('Incorrect username or password')
	}

	const existingUser = await usersModel.getOne({ email: user.email })

	if (!existingUser) {
		throw new Error('Incorrect username or password')
	}
	const checkPassword = user.password == existingUser.password
	if (!checkPassword) {
		throw new Error('Incorrect username or password')
	}
	const token = generateToken(existingUser)

	return token
}

module.exports = {
	login,
}
