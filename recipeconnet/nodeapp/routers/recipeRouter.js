const express = require("express");
const recipeController = require("../controllers/recipeController");
const { validateToken } = require("../authUtils");
const router = express.Router();
const userController = require('../controllers/userController');

router.get("/recipe",   recipeController.getAllRecipes);
router.get("/recipe/user/:userId",recipeController.getRecipesBySellerId);
router.get("/recipe/:recipeId",   recipeController.getRecipeById);
router.post("/recipe",   recipeController.addRecipe);
router.put("/recipe/:recipeId",   recipeController.updateRecipe);
router.delete("/recipe/:recipeId",   recipeController.deleteRecipe);
router.get('/users',userController.getAllUsers);

module.exports = router;
