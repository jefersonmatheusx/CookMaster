const express = require('express')
const app = express()
const { connection } = require('./connection')
const express = require('express');

require('dotenv').config()

app.use(express.json())

const startServer = () => {
  connection(process.env.MONGO_DB_URL)
}
startServer()

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send()
})
// Não remover esse end-point, ele é necessário para o avaliador

module.exports = app;

//Model
const User = require('./models/UsersModel')

module.exports = app
