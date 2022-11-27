const mongoose = require('mongoose')
const { statusCode } = require('../utils/statusCode')

module.exports = (collection) => {
	return async (req, res, next) => {
		const { id } = req.params
		const { userId, userRole } = req
		const resultCollection = await mongoose.connection.db.collection(collection)
		const dataRecived = await resultCollection.findOne({
			_id: mongoose.Types.ObjectId(id),
		})
		if (!dataRecived) {
			return next({ status: statusCode.NOT_FOUND, message: 'data not found' })
		}
		switch (userRole) {
		case 'admin':
			return next()
		case 'user':
			if (dataRecived.userId.toString() !== userId) {
				return next({
					status: statusCode.FORBIDEN,
					message: 'Forbiden: action not allowed',
				})
			}
			return next()
		default:
			return next({
				status: statusCode.FORBIDEN,
				message: 'Forbiden: action not allowed',
			})
		}
	}
}
