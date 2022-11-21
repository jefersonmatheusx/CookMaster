const express = require('express')
const {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe
} = require('../controllers/RecipesController')
const { credentials } = require('../middlewares')

const Recipes = express.Router()

Recipes.post('/', credentials, createRecipe)
Recipes.get('/', getRecipes)
Recipes.get('/:id', getRecipe)
Recipes.put('/:id', credentials, updateRecipe)

module.exports = Recipes
