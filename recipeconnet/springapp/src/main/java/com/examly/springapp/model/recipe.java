package com.examly.springapp.model;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
// import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;


@Entity
@Table(name = "recipes")
public class recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_id")
    private Long recipeId;

    // @JsonIgnore
    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private user user;

    @Column(name = "recipe_name", nullable = false)
    private String recipeName;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "ingredients", nullable = false)
    private String ingredients;

    @Column(name = "category", nullable = false)
    private String category;

    @Lob
    @Column(name = "photo", nullable = false , columnDefinition = "LONGBLOB")
    private String photo;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "serving_size", nullable = false)
    private Integer servingSize;

    // Constructors, getters, and setters

    @JsonProperty("user_id")
    public Long getUserId() {
        return this.user.getUserId();
    }

    public recipe() {
    }

    public recipe(user user, String recipeName, String description, String ingredients, String category,
                  String photo, Double price, Integer servingSize) {
        this.user = user;
        this.recipeName = recipeName;
        this.description = description;
        this.ingredients = ingredients;
        this.category = category;
        this.photo = photo;
        this.price = price;
        this.servingSize = servingSize;
    }

   
    public Long getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Long recipeId) {
        this.recipeId = recipeId;
    }

    public user getUser() {
        return user;
    }

    public void setUser(user user) {
        this.user = user;
    }

    public String getRecipeName() {
        return recipeName;
    }

    public void setRecipeName(String recipeName) {
        this.recipeName = recipeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getServingSize() {
        return servingSize;
    }

    public void setServingSize(Integer servingSize) {
        this.servingSize = servingSize;
    }

    

    
}
