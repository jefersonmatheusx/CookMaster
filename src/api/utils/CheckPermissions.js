module.exports = async (model, id, userIdReq, userRole) => {
	const modelRecived = await model.getById(id)
	if (!modelRecived) {
		throw new Error('data not found')
	}
	const error = new Error('Forbiden: action not allowed')
	error.code = 403
	error.name = 'FORBIDEN'

	switch (userRole) {
	case 'admin':
		return
	case 'user':
		if (modelRecived.userId.toString() !== userIdReq) {
			throw error
		}
		return
	default:
		throw error
	}
}
