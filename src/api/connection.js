const mongoose = require('mongoose')
require('dotenv/config')

const connection = (mongoDatabaseURI) => mongoose.connect(mongoDatabaseURI)

module.exports = {
  connection
}
