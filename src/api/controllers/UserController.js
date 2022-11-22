const userService = require('../services/UserService')
const StatusCode = require('../utils/StatusCode')

const createUser = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const newUser = await userService.createUser({
      name,
      email,
      password,
      role: 'user'
    })

    return res.status(StatusCode.CREATED).json(newUser)
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return res
        .status(StatusCode.CONFLICT)
        .json({ msg: 'email already registered' })
    }
    return res.status(StatusCode.BAD_REQUEST).json({ msg: err.message })
  }
}

const getUser = async (req, res) => {
  const { id } = req.params
  try {
    const user = await userService.getUser(id)
    if (!user) {
      throw new Error('user not found')
    }
    return res.status(StatusCode.OK).json({ user })
  } catch (err) {
    return res.status(StatusCode.NOT_FOUND).json({ msg: err.message })
  }
}

const createAdmin = async (req, res) => {
  const user = req.body
  const result = await userService.createUser({ ...user, role: 'admin' })
  res.status(StatusCode.CREATED).json({ user: result })
}

module.exports = {
  createUser,
  getUser,
  createAdmin
}
