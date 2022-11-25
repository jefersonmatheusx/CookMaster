const userService = require('../services/UserService')
const StatusCode = require('../utils/StatusCode')

const createUser = async (req, res) => {
	const { name, email, password } = req.body
	try {
		const user = await userService.createUser({
			name,
			email,
			password,
			role: 'user',
		})

		return res.status(StatusCode.CREATED).json({ user })
	} catch (err) {
		if (err.name === 'MongoServerError' && err.code === 11000) {
			return res
				.status(StatusCode.CONFLICT)
				.json({ message: 'Email already registered' })
		}
		return res.status(StatusCode.BAD_REQUEST).json({ message: err.message })
	}
}

const getUser = async (req, res) => {
	const { id } = req.params
	try {
		const user = await userService.getUser(id)
		if (!user) {
			throw new Error('Incorrect username or password')
		}
		return res.status(StatusCode.OK).json({ user })
	} catch (err) {
		return res.status(StatusCode.NOT_FOUND).json({ message: err.message })
	}
}

const createAdmin = async (req, res) => {
	const user = req.body

	try {
		const newUser = await userService.createUser({ ...user, role: 'admin' })

		return res.status(StatusCode.CREATED).json({ user:newUser })
	} catch (err) {
		if (err.name === 'MongoServerError' && err.code === 11000) {
			return res
				.status(StatusCode.CONFLICT)
				.json({ message: 'Email already registered' })
		}
		return res.status(StatusCode.BAD_REQUEST).json({ message: err.message })
	}
}

module.exports = {
	createUser,
	getUser,
	createAdmin,
}
