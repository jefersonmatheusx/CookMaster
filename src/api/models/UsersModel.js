const User = require('../schemas/UserSchema')

const create = async (user) => {
	const userResponse = await User.create(user)
	return userResponse
}

const getUsers = async () => {
	const users = await User.find({}, { _id: 0 })

	return { utxos: users }
}

const getOne = async (obj) => {
	const user = await User.findOne(obj)
	return user
}

const getById = async (id) => {
	const user = await User.findById(id, '-password ')
	return user
}

module.exports = {
	create,
	getOne,
	getUsers,
	getById,
}
