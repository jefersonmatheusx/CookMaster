const recipeService = require('../services/RecipeService')
const StatusCode = require('../utils/StatusCode')

const createRecipe = async (req, res) => {
	const recipe = req.body
	recipe.userId = req.userId
	try {
		const recipeCreated = await recipeService.createRecipe(recipe)

		return res.status(StatusCode.CREATED).json({ recipe:recipeCreated })
	} catch (err) {
		return res.status(StatusCode.BAD_REQUEST).json({ message: err.message })
	}
}

const getRecipes = async (req, res) => {
	try {
		const recipes = await recipeService.getRecipes()
		return res.status(200).json(recipes)
	} catch (err) {
		return res.status(StatusCode.NOT_FOUND).json({ message: err.message })
	}
}

const getRecipe = async (req, res) => {
	const { id } = req.params
	try {
		const recipe = await recipeService.getRecipe(id)
		if (!recipe) {
			throw new Error('recipe not found')
		}
		return res.status(StatusCode.OK).json(recipe)
	} catch (err) {
		console.log(err.message)
		return res.status(StatusCode.NOT_FOUND).json({ message: 'recipe not found' })
	}
}
const updateRecipe = async (req, res) => {
	const { id } = req.params
	const { userId, userRole } = req
	const recipeObj = req.body
	try {
		const updatedRecipe = await recipeService.updateRecipe(
			id,
			recipeObj,
			userId,
			userRole
		)

		res.status(StatusCode.OK).json(updatedRecipe)
	} catch (error) {
		res
			.status(error.code || StatusCode.INVALID_FIELD)
			.json({ message: error.message })
	}
}

const deleteRecipe = async (req, res) => {
	const { id } = req.params
	const { userId, userRole } = req
	try {
		const deletedRecipe = await recipeService.deleteRecipe(id, userId, userRole)

		res.status(StatusCode.NO_CONTENT).json(deletedRecipe)
	} catch (error) {
		res
			.status(error.code || StatusCode.INVALID_FIELD)
			.json({ message: error.message })
	}
}

const uploadImage = async (req, res) => {
	const { file } = req
	const { id } = req.params
	const { userId, userRole } = req

	try {
		const recipe = await recipeService.uploadImage(
			id,
			{ image: `localhost:3000/src/uploads/${file.filename}` },
			userId,
			userRole
		)
		res.status(StatusCode.OK).json(recipe)
	} catch (error) {
		res.status(StatusCode.BAD_REQUEST)
	}
}

module.exports = {
	createRecipe,
	getRecipes,
	getRecipe,
	updateRecipe,
	deleteRecipe,
	uploadImage,
}
