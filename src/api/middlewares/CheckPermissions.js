const mongoose = require('mongoose')
const { statusCode } = require('../utils/StatusCode')

const error = {
	forbiden: {
		status: statusCode.FORBIDEN,
		message: 'Forbiden: action not allowed',
	},
	notFound: { status: statusCode.NOT_FOUND, message: 'data not found' },
}
async function getMongoData(collection, id) {
	const resultCollection = await mongoose.connection.db.collection(collection)
	return resultCollection.findOne({ _id: mongoose.Types.ObjectId(id) })
}
module.exports = (collection) => async (req, res, next) => {
	const { id } = req.params
	const { userId, userRole } = req
	const dataRecived = await getMongoData(collection, id)
	if (!dataRecived) {
		return next(error.notFound)
	}
	switch (userRole) {
	case 'admin':
		return next()
	case 'user':
		if (dataRecived.userId.toString() !== userId) {
			return next(error.forbiden)
		}
		return next()
	default:
		return next(error.forbiden)
	}
}
