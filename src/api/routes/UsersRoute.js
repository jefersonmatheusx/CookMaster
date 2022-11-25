const express = require('express')
const { createUser, createAdmin } = require('../controllers/UserController')
const { checkUser, checkAdminPermission } = require('../middlewares')

const user = express.Router()

user.post('/', checkUser, createUser)
user.post('/admin', checkAdminPermission, createAdmin)

module.exports = user
