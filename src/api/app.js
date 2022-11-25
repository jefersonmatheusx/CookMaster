const path = require('path')
const express = require('express')
const connection = require('./connection')
const { UsersRoute, RecipesRoute, LoginRoute } = require('./routes')

const errMiddleware = require('./middlewares/errMiddleware')
require('dotenv').config()

const app = express()
app.use(express.json())

const startServer = () => {
	connection()
}
startServer()

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
	response.send()
})
// Não remover esse end-point, ele é necessário para o avaliador

app.use('/images', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/users', UsersRoute)
app.use('/login', LoginRoute)
app.use('/recipes', RecipesRoute)

app.use(errMiddleware)

module.exports = app
