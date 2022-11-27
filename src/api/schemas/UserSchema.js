const { Schema, model } = require('mongoose')
const { validateEmail, emailFormat } = require('../validation/validateEmail')
const { usersMessages } = require('../utils/StatusCode')

const UserSchema = new Schema(
	{
		name: { type: String, required: [true, usersMessages.invalidEntries] },
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true,
			required: [true, usersMessages.invalidEntries],
			validate: [validateEmail, usersMessages.invalidEntries],
			match: [emailFormat, usersMessages.invalidEntries],
		},
		password: {
			type: String,
			required: [true, usersMessages.invalidEntries],
			trim: true,
		},
		role: { type: String, required: true },
	},
	{ versionKey: false },
)

const User = model('User', UserSchema)

module.exports = User
