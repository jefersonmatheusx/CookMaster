const { statusCode } = require('../utils/StatusCode')

const checkUser = (req, res, next) => {
	const recipe = req.body

	if (!recipe || !recipe.name || !recipe.ingredients || !recipe.preparation) {
		return next({
			message: 'Invalid entries. Try again.',
			status: statusCode.BAD_REQUEST,
		})
	}

	return next()
}

module.exports = checkUser
