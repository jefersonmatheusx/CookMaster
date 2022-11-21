const { Schema, model } = require('mongoose')

const RecipeSchema = new Schema({
  name: { type: String, required: [true, 'Invalid entries. Try again'] },
  ingredients: { type: String, required: [true, 'Invalid entries. Try again'] },
  preparation: { type: String, required: [true, 'Invalid entries. Try again'] },
  imageUrl: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

const Recipe = model('Recipe', RecipeSchema)

module.exports = Recipe
