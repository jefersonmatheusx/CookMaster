const recipeModel = require('../models/RecipeModel')
const createRecipe = async (obj) => {
	const create = await recipeModel.create(obj)
	return create
}

const getRecipes = async () => {
	return recipeModel.getRecipes()
}

const getRecipe = async (id) => {
	return recipeModel.getById(id)
}

const updateRecipe = async (id, recipeObj) => {
	return recipeModel.updateOne(id, recipeObj)
}

const uploadImage = async (id, recipeObj) => {
	return recipeModel.updateOne(id, recipeObj)
}

const deleteRecipe = async (id) => {
	return recipeModel.deleteOne(id)
}

module.exports = {
	createRecipe,
	getRecipes,
	getRecipe,
	updateRecipe,
	deleteRecipe,
	uploadImage,
}
