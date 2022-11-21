const express = require('express')
const {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe
} = require('../controllers/RecipesController')
const { credentials } = require('../middlewares')

const Recipes = express.Router()

Recipes.post('/', credentials, createRecipe)
Recipes.get('/', getRecipes)
Recipes.get('/:id', getRecipe)
Recipes.put('/:id', credentials, updateRecipe)
Recipes.delete('/:id', credentials, deleteRecipe)

module.exports = Recipes
