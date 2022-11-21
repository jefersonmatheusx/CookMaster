const usersModel = require('../models/UsersModel')

const createUser = async (obj) => {
  const newUser = await usersModel.create({ ...obj, role: 'user' })
  return newUser
}

const getUser = async (id) => {
  const user = usersModel.getById(id)
  return user
}

module.exports = {
  createUser,
  getUser
}
