require('dotenv').config()
const mongoose = require('mongoose')

const DB_NAME = 'Cookmaster'
const MONGO_DB_URL = `mongodb://${process.env.HOST || 'mongodb'}:27017/${DB_NAME}`
const { connection } = mongoose

connection.on('open', () => {
	console.log('mongodb is connected!!')
})
connection.on('error', console.error.bind(console, 'connection error:'))

module.exports = () => mongoose.connect(MONGO_DB_URL)
