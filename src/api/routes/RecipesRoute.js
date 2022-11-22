const express = require('express')
const multer = require('multer')
const multerConfig = require('../config/multer')
const {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  uploadImage
} = require('../controllers/RecipesController')
const { credentials, checkPermissions } = require('../middlewares')

const Recipes = express.Router()

Recipes.post('/', credentials, createRecipe)
Recipes.get('/', getRecipes)
Recipes.get('/:id', getRecipe)
Recipes.put('/:id', credentials, updateRecipe)
Recipes.put(
  '/:id/image/',
  credentials,
  multer(multerConfig).single('image'),
  uploadImage
)
Recipes.delete('/:id', credentials, deleteRecipe)

module.exports = Recipes
