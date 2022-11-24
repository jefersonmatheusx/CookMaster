const express = require('express')
const {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  uploadImage
} = require('../controllers/RecipesController')

const { credentials, multer, checkPermissions } = require('../middlewares')
const checkObjectId = require('../middlewares/checkObjectId')

const Recipes = express.Router()
const permissions = checkPermissions('recipes')

Recipes.post('/', credentials, createRecipe)
Recipes.get('/', getRecipes)
Recipes.get('/:id', checkObjectId, getRecipe)
Recipes.delete(
  '/:id',
  checkObjectId,
  credentials,
  permissions,
  deleteRecipe
)
Recipes.put('/:id', checkObjectId, credentials, permissions, updateRecipe)
Recipes.put(
  '/:id/image/',
  checkObjectId,
  credentials,
  permissions,
  multer,
  uploadImage
)

module.exports = Recipes
