const express = require('express')
const { userLogin } = require('../controllers/LoginController')

const user = express.Router()

user.post('/', userLogin)

module.exports = user
