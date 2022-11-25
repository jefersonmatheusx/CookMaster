const mongoose = require('mongoose')
require('dotenv').config()
const DB_NAME = 'Cookmaster'
const MONGO_DB_URL = `mongodb://${
	process.env.HOST || 'mongodb'
}:27017/${DB_NAME}`
const connection = mongoose.connection

connection.on('open', function () {
	console.log('mongodb is connected!!')
})
connection.on('error', console.error.bind(console, 'connection error:'))

module.exports = () => mongoose.connect(MONGO_DB_URL)
