const recipeModel = require('../models/RecipeModel')
const checkPermissions = require('../utils/checkPermissions')
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

const updateRecipe = async (id, recipeObj, userIdReq, userRole) => {
  await checkPermissions(recipeModel, id, userIdReq, userRole)
  return recipeModel.updateOne(id, recipeObj)
}

const uploadImage = async (id, recipeObj, userIdReq, userRole) => {
  await checkPermissions(recipeModel, id, userIdReq, userRole)
  return recipeModel.updateOne(id, recipeObj)
}

const deleteRecipe = async (id, userIdReq, userRole) => {
  await checkPermissions(recipeModel, id, userIdReq, userRole)
  return recipeModel.deleteOne(id)
}

module.exports = {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  uploadImage
}
