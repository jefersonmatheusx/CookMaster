const recipeService = require('../services/RecipeService')
const StatusCode = require('../utils/StatusCode')

const createRecipe = async (req, res) => {
  const { name, ingredients, preparation } = req.body
  const { userId } = req
  try {
    const recipe = await recipeService.createRecipe({
      name,
      ingredients,
      preparation,
      userId
    })

    return res.status(StatusCode.CREATED).json({ recipe })
  } catch (err) {
    return res.status(StatusCode.BAD_REQUEST).json({ msg: err.message })
  }
}

const getRecipes = async (req, res) => {
  try {
    const recipes = await recipeService.getRecipes()
    return res.status(200).json(recipes)
  } catch (err) {
    return res.status(StatusCode.NOT_FOUND).json({ msg: err.message })
  }
}

const getRecipe = async (req, res) => {
  const { id } = req.params
  try {
    const recipe = await recipeService.getRecipe(id)
    if (!recipe) {
      throw new Error('recipe not found')
    }
    return res.status(StatusCode.OK).json(recipe)
  } catch (err) {
    console.log(err.message)
    return res.status(StatusCode.NOT_FOUND).json({ msg: 'recipe not found' })
  }
}
const updateRecipe = async (req, res) => {
  const { id } = req.params
  const { userId, userRole } = req
  const recipeObj = req.body
  try {
    const updatedRecipe = await recipeService.updateRecipe(
      id,
      recipeObj,
      userId,
      userRole
    )

    res.status(StatusCode.OK).json(updatedRecipe)
  } catch (error) {
    res
      .status(error.code || StatusCode.INVALID_FIELD)
      .json({ msg: error.message })
  }
}

const deleteRecipe = async (req, res) => {
  const { id } = req.params
  const { userId, userRole } = req
  try {
    const deletedRecipe = await recipeService.deleteRecipe(id, userId, userRole)

    res.status(StatusCode.NO_CONTENT).json(deletedRecipe)
  } catch (error) {
    res
      .status(error.code || StatusCode.INVALID_FIELD)
      .json({ msg: error.message })
  }
}

const uploadImage = async (req, res) => {
  const { file } = req
  const { id } = req.params
  const { userId, userRole } = req

  try {
    const recipe = await recipeService.uploadImage(
      id,
      { imageUrl: `localhost:3000/src/uploads/${file.filename}` },
      userId,
      userRole
    )
    res.status(StatusCode.OK).json(recipe)
  } catch (error) {
    res.status(StatusCode.BAD_REQUEST)
  }
}

module.exports = {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  uploadImage
}
