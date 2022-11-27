const express = require('express')
const {
	createRecipe,
	getRecipes,
	getRecipe,
	updateRecipe,
	deleteRecipe,
	uploadImage,
} = require('../controllers/RecipesController')

const { credentials, multer, checkPermissions, checkRecipe } = require('../middlewares')

const Recipes = express.Router()
const permissions = checkPermissions('recipes')

Recipes.post('/', credentials,checkRecipe, createRecipe)
Recipes.get('/', getRecipes)
Recipes.get('/:id', getRecipe)
Recipes.delete('/:id',  credentials, permissions, deleteRecipe)
Recipes.put('/:id',  credentials, permissions, updateRecipe)
Recipes.put(
	'/:id/image/',
	credentials,
	permissions,
	multer,
	uploadImage
)

module.exports = Recipes
