const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(), // Auto-generate ObjectId for recipeId
    unique: true,
  },
  recipeName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  price: {
    type: Number, // Price per day in USD
    required: true,
  },
  servingSize: {
    type: Number, 
    required: true,
  },


});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;