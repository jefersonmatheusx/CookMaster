const Recipe = require('../schemas/recipeSchema')

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

const update = async (id, obj) => {
  return Recipe.findOneAndUpdate(
    { _id: id },
    { $set: obj },
    {
      new: true
    }
  )
}

module.exports = {
  create,
  getOne,
  getRecipes,
  getById,
  update
}
