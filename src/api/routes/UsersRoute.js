const express = require('express')
const { createUser, getUser } = require('../controllers/UserController')
const { credentials } = require('../middlewares')

const user = express.Router()

user.post('/', createUser)
user.get('/:id', credentials, getUser)

module.exports = user
