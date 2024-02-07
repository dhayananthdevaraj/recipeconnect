const Recipe = require('../models/recipeModel');

const getAllRecipes = async (req, res) => {
  try {
    const sortValue = req.query.sortValue || 1; 
    const search = req.query.searchValue || '';
    const searchRegex = new RegExp(search, 'i'); 
    const recipes = await Recipe.find({ recipeName: searchRegex }).select('-_id -__v')
      .sort({ price: parseInt(sortValue) });

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getRecipeById = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findOne({recipeId}).select('-_id -__v');

    if (!recipe) {
      res.status(404).json({ message: 'Cannot find any recipe' });
    } else {
      res.status(200).json(recipe);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(200).json({ message: 'recipe added successfully' });
  } catch (error) {
    console.log("error is",error);
    res.status(500).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
      const { recipeId } = req.params;
      const recipe = await Recipe.findOneAndUpdate({recipeId}, req.body, { new: true });

      if (!recipe) {
        res.status(404).json({ message: 'Cannot find any recipe' });
      } else {
        res.status(200).json({ message: 'Recipe updated successfully' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const deleteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    console.log("Id", recipeId);
    const recipe = await Recipe.findOneAndDelete({recipeId});

    if (!recipe) {
      res.status(404).json({ message: 'Cannot find any recipe' });
    } else {
      res.status(200).json({ message: 'Recipe deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getRecipesBySellerId = async (req, res) => {
  try {
    const {userId} = req.params;
    console.log("User", userId);
    const search = req.query.searchTerm || ''; // Default to empty string if not provided
    const searchRegex = new RegExp(search, 'i'); // Case-insensitive search regex
    console.log("search", search);

    const recipes = await Recipe.find({ userId: userId, recipeName: searchRegex }).select('-_id -__v')

    // console.log("recipes", recipes);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesBySellerId
};
