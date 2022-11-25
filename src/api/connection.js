const mongoose = require('mongoose')

const connection = mongoose.connection

connection.on('open', function () {
	console.log('mongodb is connected!!')
})
connection.on('error', console.error.bind(console, 'connection error:'))

module.exports = (mongoDatabaseURI) => mongoose.connect(mongoDatabaseURI)
