import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProducts.css";
import axios from "axios";
import { apiUrl } from "../apiconfig.js";

const UserProducts = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showLogoutPopup, SetshowLogoutPopup] = useState(false);
  const [productToBeDelete, setProductToBeDelete] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("editId", "");
    console.log("came in grid");
    fun();
  }, [searchTerm, sortValue]);

  async function fun() {
    try {
      const token = localStorage.getItem("token");

      console.log("inside function");
const productResponse = await axios.get(
  apiUrl + `/api/recipe/user/${JSON.parse(localStorage.getItem("userData")).userId}`  ,
  { 
    headers: { Authorization: `${token}` },
    params: { searchTerm: searchTerm, sortValue: sortValue }
  }
);
      console.log("productResponse", productResponse);
      if (productResponse.status === 200) {
        setProducts(productResponse.data);
      }
    } catch (error) {
      // navigate("/error");
    }
  }

  const handleDeleteClick = (id) => {
    setProductToBeDelete(id);
    setShowDeletePopup(true);
  };

  async function deletefunction() {
    const productId = productToBeDelete;

    try {
      const token = localStorage.getItem("token");

      let deleteResponse = await axios.delete(
        apiUrl + `/api/recipe/${productId}`,
        { headers: { Authorization: `${token}` } }
      );
      if (deleteResponse.status === 200) {
        fun();
      }
      setShowDeletePopup(false);
    } catch (error) {
      console.log("error", error);
    }
  }

  
  const openPopup = (recipe) => {
    setSelectedRecipe(recipe);
    setShowPopup(true);
};

const closePopup = () => {
    setSelectedRecipe(null);
    setShowPopup(false);
};

  return (
    <div>
      <div className={`ProductsList ${showDeletePopup||showLogoutPopup? "popup-open" : ""}`}>
        <button
          className="styledbutton"
          onClick={() => {
            // navigate("/login");
            SetshowLogoutPopup(true)
          }}
        >
          Logout
        </button>
        <button
          className="styledbutton"
          onClick={() => navigate("/createproduct")}
        >
          Add new Recipe
        </button>
        <h1>My Recipe</h1>
        {/* Search functionality */}
        <input
          className="search"
          type="text"
          placeholder="Search by recipe name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Card layout */}
        <div className="card-container">
          {products.length ? (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.photo} alt={product.recipeName} onClick={() => openPopup(product)} />
                <div className="card-details">
                  <h2>{product.recipeName}</h2>
                  <p> {product.description}</p>
                  <p>Recipe Price:  {product.price}</p>
                  <p>Category : {product.category}</p>
                  <div className="action-buttons">
                    <button className="styledbutton"
                      style={{ backgroundColor: "red" , width:"100px" }}
                      onClick={() => {
                        handleDeleteClick(product.recipeId);
                      }}
                    >
                      Delete
                    </button>
                    <button className="styledbutton"
                      style={{ backgroundColor: "green" , width:"100px" }}
                      onClick={() => {
                        localStorage.setItem("editId", product.recipeId);
                        navigate("/createproduct");
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="norecord">No records found</div>
          )}
        </div>
      </div>

      {showPopup && selectedRecipe && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>

                        <h2>{selectedRecipe.recipeName}</h2>
                        <h2>Details</h2>
                        <p><strong>Description: </strong> {selectedRecipe.description}</p>
                        <p><strong>Recipe Price: </strong>{selectedRecipe.price}</p>
                        <p><strong>Category: </strong> {selectedRecipe.category}</p>
                        <p><strong>Serve: </strong> {selectedRecipe.servingSize}</p>
                        <p><strong>Ingrediants: </strong>{selectedRecipe.ingredients}</p>
                    </div>
                </div>
            )}


      {showDeletePopup && (
        <div className="delete-popup">
          <p>Are you sure you want to delete?</p>
          <button onClick={deletefunction}>Yes, Delete</button>
          <button
            onClick={() => {
              setShowDeletePopup(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
       {showLogoutPopup && (
        <div className="delete-popup">
          <p>Are you sure you want to Logout?</p>
          <button onClick={()=>{
            localStorage.clear();
            navigate("/login");
          }}>Yes, Logout</button>
          <button
            onClick={() => {
              SetshowLogoutPopup(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProducts;
