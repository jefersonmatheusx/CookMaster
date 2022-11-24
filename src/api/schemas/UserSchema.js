const { Schema, model } = require('mongoose')
const validateEmail = require('../validation/validateEmail')
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new Schema(
  {
    name: { type: String, required: [true, 'Invalid entries. Try again'] },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Invalid entries. Try again'],
      validate: [validateEmail, 'Invalid entries. Try again'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Invalid entries. Try again'
      ]
    },
    password: {
      type: String,
      required: [true, 'Invalid entries. Try again'],
      trim: true
    },
    role: { type: String, required: true }
  },
  { versionKey: false }
)

const User = model('User', UserSchema)

module.exports = User
