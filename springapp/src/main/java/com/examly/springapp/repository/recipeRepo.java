package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.recipe;


@Repository
public interface recipeRepo extends JpaRepository<recipe, Long>{

     List<recipe> findByRecipeNameIgnoreCaseContainingAndUser_UserId(String recipeName, Long userId);
     
     List<recipe> findByRecipeNameIgnoreCaseContainingOrderByPrice(String recipeName, Sort sort);
     List<recipe> findByRecipeNameIgnoreCaseContaining(String recipeName, Sort sort);

     List<recipe> findByRecipeNameIgnoreCaseContainingAndUser_UserIdOrderByPrice(String recipeName, Long userId, Sort sort);
     List<recipe> findByUser_UserId(Long userId, Sort sort);


  


     
}
