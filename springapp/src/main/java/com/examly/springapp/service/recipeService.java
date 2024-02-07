package com.examly.springapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.examly.springapp.exception.EntityNotFoundException;
import com.examly.springapp.model.recipe;
import com.examly.springapp.repository.recipeRepo;


@Service
public class recipeService {

   

    @Autowired
    public recipeRepo recipeRepository;

    public List<recipe> getAllRecipes(String searchValue, int sortValue) {
        Sort sort = Sort.by(sortValue == -1 ? Sort.Direction.DESC : Sort.Direction.ASC, "price");
        if (searchValue != null && !searchValue.isEmpty()) {
            return recipeRepository.findByRecipeNameIgnoreCaseContaining(searchValue, sort);
        }else {
            return recipeRepository.findAll(sort);
        }

       
    }

    public List<recipe> getRecipesBySellerId(Long userId, String searchTerm , int sortValue) {
        // Implement logic to retrieve recipes by userId and searchValue
        Sort sort = Sort.by(sortValue == -1 ? Sort.Direction.DESC : Sort.Direction.ASC, "price");
        if (searchTerm != null && !searchTerm.isEmpty()) {
            return recipeRepository.findByRecipeNameIgnoreCaseContainingAndUser_UserIdOrderByPrice(searchTerm, userId, sort);
        } else {
            return recipeRepository.findByUser_UserId(userId, sort);
        }
        
    }

    

    
    public recipe getRecipeById(Long recipeId) {
        return recipeRepository.findById(recipeId)
            .orElseThrow(() -> new EntityNotFoundException("Cannot find any recipe"));
    }

 

    public void addRecipe(recipe recipe) {
        // Implement logic to add a new recipe
        recipeRepository.save(recipe);
    }

    public void updateRecipe(Long recipeId, recipe updatedRecipe) {
        recipe existingRecipe = recipeRepository.findById(recipeId)
            .orElseThrow(() -> new EntityNotFoundException("Cannot find any recipe"));

        existingRecipe.setRecipeName(updatedRecipe.getRecipeName());
        existingRecipe.setDescription(updatedRecipe.getDescription());
        existingRecipe.setIngredients(updatedRecipe.getIngredients());
        existingRecipe.setCategory(updatedRecipe.getCategory());
        existingRecipe.setPhoto(updatedRecipe.getPhoto());
        existingRecipe.setPrice(updatedRecipe.getPrice());
        existingRecipe.setServingSize(updatedRecipe.getServingSize());

        recipeRepository.save(existingRecipe);
    }

  

    public void deleteRecipe(Long recipeId) {
        if (recipeRepository.existsById(recipeId)) {
            recipeRepository.deleteById(recipeId);
        } else {
            throw new EntityNotFoundException("Cannot find any recipe");
        }
    }
}
