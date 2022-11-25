const usersModel = require('../models/UsersModel')

const createUser = async (user) => {
	const newUser = await usersModel.create(user)
	return newUser
}

const getUser = async (id) => {
	const user = usersModel.getById(id)
	return user
}

module.exports = {
	createUser,
	getUser,
}
