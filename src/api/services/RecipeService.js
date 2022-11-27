const recipeModel = require('../models/RecipeModel')

const createRecipe = async (obj) => {
	const create = await recipeModel.create(obj)
	return create
}

const getRecipes = async () => recipeModel.getRecipes()

const getRecipe = async (id) => recipeModel.getById(id)

const updateRecipe = async (id, recipeObj) => {
	if (!Object.keys(recipeObj).length) {
		throw new Error('Invalid entries. Try again.')
	}
	return recipeModel.updateOne(id, recipeObj)
}

const uploadImage = async (id, recipeObj) => recipeModel.updateOne(id, recipeObj)

const deleteRecipe = async (id) => recipeModel.deleteOne(id)

module.exports = {
	createRecipe,
	getRecipes,
	getRecipe,
	updateRecipe,
	deleteRecipe,
	uploadImage,
}
