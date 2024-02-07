import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreateProduct.css";
import axios from 'axios';
import { apiUrl } from '../apiconfig';

const CreateProduct = () => {
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    recipeName: '',
    description: '',
    ingredients: '',
    category: '',
    price: 0,
    photo: null,
    servingSize: 0
  });

  const [errors, setErrors] = useState({
    recipeName: '',
    description: '',
    ingredients: '',
    category : '',
    price: '',
    photo: '',
    servingSize:''
  });

  useEffect(() => {
    console.log("localStorage.getItem",localStorage.getItem("editId"));
    let a=localStorage.getItem("editId")
    if(a !== "") {
      editfun();
    }
  }, []);

  async function editfun() { 
    const token = localStorage.getItem("token");

    try {
      let response = await axios.get(apiUrl + "/api/recipe/" + localStorage.getItem("editId"),
        { headers: { Authorization: `${token}` } }
      );

      console.log("response in id", response);
      setProductData(response.data);
    } catch (error) {
      navigate("/error");
    }
  }

  const handleInputChange = (e) => {
    // console.log(e.target.value,e.target.name);
    setProductData({ ...productData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      convertFileToBase64(file);
    }
  };

  // Convert file to base64
  const convertFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductData({ ...productData, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = async () => {
    // Validate the form before submitting
    const validationErrors = {};

    if (productData.recipeName === "") {
      validationErrors.recipeName = "Recipe name is required";
    }
    if (productData.description === "") {
      validationErrors.description = "Description is required";
    }
    if (productData.ingredients.length === 0) {
      validationErrors.ingredients = "At least one ingredient is required";
    }
    if (productData.category === "") {
      validationErrors.category = "Category is required";
    }
    if (productData.price === 0) {
      validationErrors.price = "Price should be greater than 0";
    }
    if (productData.photo === null) {
      validationErrors.photo = "Please select a photo";
    }
    if (productData.servingSize === 0) {
      validationErrors.servingSize = "Serving Size should be greater than 0";
    }


    console.log("validationErrors", validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Rest of the code remains the same
    // ...
    // productData.photo = ["./assets/" + productData.title + ".jpg"];
    productData.userId = JSON.parse(localStorage.getItem("userData")).userId;

    console.log("productData", productData);

    try {
      let a = localStorage.getItem("editId");
      if (a === "") {
        const token = localStorage.getItem("token");
        console.log("token", token);
        console.log("productData",productData);
        let createProductRespose = await axios.post(apiUrl + "/api/recipe", productData,
          {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `${token}`
            }
          });

        if (createProductRespose.status === 200) {
          navigate("/userproducts");
        }
      } else {
        const token = localStorage.getItem("token");

        let updateProduct = await axios.put(apiUrl + "/api/recipe/" + localStorage.getItem("editId"), productData,
          {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `${token}`
            }
          });

        if (updateProduct.status === 200) {
          navigate("/userproducts");
        }
      }
    } catch (error) {
      navigate("/error");
    }
  };

  
  // const handleCheckboxChange = (e) => {
  //   const amenity = e.target.value;
  //   const isChecked = e.target.checked;

  //   setProductData((prevData) => {
  //     if (isChecked) {
  //       return { ...prevData, amenities: [...prevData.amenities, amenity] };
  //     } else {
  //       return { ...prevData, amenities: prevData.amenities.filter(item => item !== amenity) };
  //     }
  //   });
  // };


  const recipeCategories = ['Main Course', 'Appetizer', 'Dessert', 'Beverage', 'Snack', 'Breakfast', 'Lunch', 'Dinner', 'Soup', 'Salad', 'Side Dish' , 'Sea Dish' , 'Other'];

  return (
    <div className="create-product-container">
      <button onClick={() => navigate(-1)}>Back</button>

      {localStorage.getItem("editId") === "" ? <h2>Create New Recipe</h2> : <h2>Update Recipe</h2>}

      <div className="form-group">
          <label>Recipe Name:</label>
          <input
            type="text"
            name="recipeName"
            value={productData.recipeName}
            onChange={handleInputChange}
          />
          <span className="error-message">{errors.recipeName}</span>
        </div>
        <div className="form-group">
          <label>Photo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <span className="error-message">{errors.photo}</span>
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleInputChange}
          />
          <span className="error-message">{errors.description}</span>
        </div>

        <div className="form-group">
          <label>Ingredients:</label>
          <input
            type="text"
            name="ingredients"
            value={productData.ingredients}
            onChange={handleInputChange}
          />
          <span className="error-message">{errors.ingredients}</span>
        </div>

      <div className="form-group">
        <label>Recipe Category:</label>
        <select
          name="category"
          value={productData.category}
          onChange={handleInputChange}
        >
          <option value="" disabled>Select recipe category</option>
          {recipeCategories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <span className="error-message">{errors.category}</span>
      </div>

      <div className="form-group">
        <label>Serving Size:</label>
        <input
          type="number"
          name="servingSize"
          value={productData.servingSize}
          onChange={handleInputChange}
        />
        <span className="error-message">{errors.servingSize}</span>
      </div>

  
      <div className="form-group">
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleInputChange}
        />
        <span className="error-message">{errors.price}</span>
      </div>

   

      <button className='submit-button' type="button" onClick={handleCreateProduct}>
        {localStorage.getItem("editId") === "" ? "Create Recipe" : "Update Recipe"}
      </button>
    </div>
  );
};

export default CreateProduct;
