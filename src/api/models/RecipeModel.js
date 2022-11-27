const Recipe = require('../schemas/RecipeSchema')

const create = async (recipe) => {
	const recipeResponse = await Recipe.create(recipe)
	return recipeResponse
}

const getRecipes = async () => {
	const recipes = await Recipe.find({})

	return recipes
}

const getOne = async (obj) => {
	const recipe = await Recipe.findOne(obj)
	return recipe
}

const getById = async (id) => {
	const recipe = await Recipe.findById(id)
	return recipe
}

const updateOne = async (id, obj) =>
	Recipe.findOneAndUpdate(
		{ _id: id },
		{ $set: obj },
		{
			new: true,
		},
	)

const deleteOne = async (id) => Recipe.deleteOne({ _id: id })

module.exports = {
	create,
	getOne,
	getRecipes,
	getById,
	updateOne,
	deleteOne,
}
