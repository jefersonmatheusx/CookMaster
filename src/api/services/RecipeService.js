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
  const hasChecked = await checkPermissions(
    recipeModel,
    id,
    userIdReq,
    userRole
  )
  if (!hasChecked) {
    const error = new Error('Forbiden: not allowed to do this action')
    error.code = 403
    error.name = 'FORBIDEN'
    throw error
  }
  return recipeModel.updateOne(id, recipeObj)
}
const deleteRecipe = async (id, userIdReq, userRole) => {
  const hasChecked = await checkPermissions(
    recipeModel,
    id,
    userIdReq,
    userRole
  )
  if (!hasChecked) {
    const error = new Error('Forbiden: not allowed to do this action')
    error.code = 403
    error.name = 'FORBIDEN'
    throw error
  }
  return recipeModel.deleteOne(id)
}

module.exports = {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe
}
