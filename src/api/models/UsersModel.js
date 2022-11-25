const User = require('../schemas/UserSchema')

const create = async (user) => {
	const dataUser = await User.create(user)
	const userResponse = await getById(dataUser._id)
	return userResponse
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
	getById,
}
