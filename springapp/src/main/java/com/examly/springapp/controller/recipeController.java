package com.examly.springapp.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.examly.springapp.exception.EntityNotFoundException;
import com.examly.springapp.model.recipe;
import com.examly.springapp.model.user;
import com.examly.springapp.service.recipeService;
import com.examly.springapp.service.userService;



@Controller
@RequestMapping("/api")
public class recipeController {

    @Autowired
    public recipeService recipeService;

    @Autowired
    public userService userService;

    @GetMapping("/recipe")
    public ResponseEntity<List<recipe>> getAllRecipes(
                                                             @RequestParam(required = false, defaultValue = "") String searchValue, 
                                                             @RequestParam(required = false, defaultValue = "-1") int sortValue){
        try {
            List<recipe> recipes = recipeService.getAllRecipes(searchValue ,sortValue );
            if (recipes.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(recipes, HttpStatus.OK);
        } catch (Exception e) {
            // Log the exception
            // System.out.println(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/recipe/user/{userId}")
    public ResponseEntity<List<recipe>> getRecipesBySellerId(@PathVariable Long userId,
                                                             @RequestParam(required = false, defaultValue = "") String searchTerm,
                                                              @RequestParam(required = false, defaultValue = "-1") int sortValue) {
        List<recipe> recipes = recipeService.getRecipesBySellerId(userId, searchTerm ,sortValue);
        return ResponseEntity.ok(recipes);
    }

    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<?> getRecipeById(@PathVariable Long recipeId) {
        try {
                recipe recipe = recipeService.getRecipeById(recipeId);
                return ResponseEntity.ok(recipe);
            } catch (EntityNotFoundException e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }
        }

        @PostMapping("/recipe")
        public ResponseEntity<Map<String, String>> addRecipe(@RequestBody Map<String, Object> payload) {
            if (!payload.containsKey("userId")) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "User ID is missing");
                return ResponseEntity.badRequest().body(response);
            }

            Long user_id = Long.valueOf((Integer) payload.get("userId"));
            user user = userService.getUserById(user_id);  // Fetch the user from the database

            // Add similar null checks for other fields as well

            String recipeName = (String) payload.get("recipeName");
            String description = (String) payload.get("description");
            String ingredients = (String) payload.get("ingredients");
            String category = (String) payload.get("category");
            String photo = (String) payload.get("photo");
            Double price = Double.valueOf((String) payload.get("price"));
            Integer servingSize = Integer.valueOf((String) payload.get("servingSize"));

            recipe newRecipe = new recipe(user, recipeName, description, ingredients, category, photo, price, servingSize);
            recipeService.addRecipe(newRecipe);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Recipe added successfully");
            return ResponseEntity.ok(response);
        }
    


    @PutMapping("/recipe/{recipeId}")
    public ResponseEntity<Map<String, String>> updateRecipe(@PathVariable Long recipeId, @RequestBody recipe updatedRecipe) {
        try {
            recipeService.updateRecipe(recipeId, updatedRecipe);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Recipe updated successfully");
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
   
    @DeleteMapping("/recipe/{recipeId}")
    public ResponseEntity<Map<String, String>> deleteRecipe(@PathVariable Long recipeId) {
        try {
            recipeService.deleteRecipe(recipeId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Recipe deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

     @GetMapping("/users")
            public ResponseEntity<List<user>> getAllUsers() {
                try {
                    List<user> users = userService.getAllUsers();
                    return ResponseEntity.ok(users);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
                }
            }   
}
